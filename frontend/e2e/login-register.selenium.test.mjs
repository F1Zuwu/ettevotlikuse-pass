import assert from "node:assert/strict";
import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import chromedriver from "chromedriver";

const FRONTEND_BASE_URL = process.env.E2E_FRONTEND_URL || "http://127.0.0.1:5173";
const BACKEND_BASE_URL = process.env.E2E_BACKEND_URL || "http://127.0.0.1:3005";
const HEADLESS = process.env.E2E_HEADLESS !== "false";

const timeoutMs = 10_000;
const startupTimeoutMs = 15_000;
const driverStartupTimeoutMs = 20_000;

const makeRandomEmail = () => {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
  return `selenium-user-${suffix}@example.com`;
};

const buildDriver = async () => {
  const options = new chrome.Options();
  const service = new chrome.ServiceBuilder(chromedriver.path);

  if (HEADLESS) {
    options.addArguments("--headless=new");
  }

  options.addArguments("--window-size=1400,1000");
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");

  return new Builder()
    .forBrowser("chrome")
    .setChromeService(service)
    .setChromeOptions(options)
    .build();
};

const findById = async (driver, id) => {
  const selector = By.css(`#${id}`);
  return driver.wait(until.elementLocated(selector), timeoutMs);
};

const getSubmitButton = async (driver, labelText) => {
  const buttonXPath = `//button[.//h1[normalize-space()='${labelText}'] or normalize-space()='${labelText}']`;
  return driver.wait(until.elementLocated(By.xpath(buttonXPath)), timeoutMs);
};

const fillInput = async (driver, id, value) => {
  const input = await findById(driver, id);
  await input.clear();
  await input.sendKeys(value);
};

const waitForErrorMessage = async (driver, expectedText) => {
  await driver.wait(async () => {
    const source = await driver.getPageSource();
    return source.includes(expectedText);
  }, timeoutMs);
};

const clearSessionStorage = async (driver) => {
  await driver.get(`${FRONTEND_BASE_URL}/`);
  await driver.executeScript("window.localStorage.clear(); window.sessionStorage.clear();");
};

const waitForService = async (url, name, timeout = startupTimeoutMs) => {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < timeout) {
    try {
      const response = await fetch(url, { method: "GET" });

      if (response.ok || response.status < 500) {
        return;
      }

      lastError = new Error(`${name} responded with status ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const reason = lastError?.message || "Unknown connection error";
  throw new Error(
    `${name} is not reachable at ${url} within ${timeout}ms. ${reason}`
  );
};

const ensureServicesAreReady = async () => {
  await waitForService(`${FRONTEND_BASE_URL}/`, "Frontend");
  await waitForService(`${BACKEND_BASE_URL}/api-docs.json`, "Backend");
};

const waitForPathname = async (driver, expectedPathname) => {
  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl();

    try {
      return new URL(currentUrl).pathname === expectedPathname;
    } catch {
      return false;
    }
  }, timeoutMs);
};

const withTimeout = (promise, ms, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);

const testRegisterPasswordMismatch = async (driver) => {
  await driver.get(`${FRONTEND_BASE_URL}/register`);

  await fillInput(driver, "nimi", "Selenium Test");
  await fillInput(driver, "email", makeRandomEmail());
  await fillInput(driver, "parool", "TestParool123!");
  await fillInput(driver, "kinnita_parool", "MitteSamaParool123!");

  const termsCheckbox = await findById(driver, "noustun");
  await termsCheckbox.click();

  const submitButton = await getSubmitButton(driver, "Registreeru");
  await submitButton.click();

  await waitForErrorMessage(driver, "Paroolid ei ühti.");
};

const testRegisterAndLoginSuccess = async (driver) => {
  const email = makeRandomEmail();
  const password = "TestParool123!";

  await driver.get(`${FRONTEND_BASE_URL}/register`);

  await fillInput(driver, "nimi", "Selenium User");
  await fillInput(driver, "email", email);
  await fillInput(driver, "parool", password);
  await fillInput(driver, "kinnita_parool", password);

  const termsCheckbox = await findById(driver, "noustun");
  await termsCheckbox.click();

  const submitButton = await getSubmitButton(driver, "Registreeru");
  await submitButton.click();

  await waitForPathname(driver, "/");

  await driver.get(`${FRONTEND_BASE_URL}/login`);

  await fillInput(driver, "email", email);
  await fillInput(driver, "parool", password);

  const loginButton = await getSubmitButton(driver, "Logi sisse");
  await loginButton.click();

  await driver.wait(async () => {
    const token = await driver.executeScript("return window.localStorage.getItem('token');");
    return Boolean(token);
  }, timeoutMs);

  const storedUser = await driver.executeScript("return window.localStorage.getItem('user');");
  assert.ok(storedUser, "Expected localStorage.user after successful login");

  await waitForPathname(driver, "/");
};

const testLoginInvalidCredentials = async (driver) => {
  await driver.get(`${FRONTEND_BASE_URL}/login`);

  await fillInput(driver, "email", makeRandomEmail());
  await fillInput(driver, "parool", "ValeParool123!");

  const loginButton = await getSubmitButton(driver, "Logi sisse");
  await loginButton.click();

  await driver.wait(async () => {
    const source = await driver.getPageSource();
    return source.includes("Invalid credentials") || source.includes("Login failed");
  }, timeoutMs);
};

const main = async () => {
  const keepAlive = setInterval(() => {}, 1000);
  let driver;

  try {
    console.log("Starting Selenium login/register tests...");
    await ensureServicesAreReady();
    console.log("Frontend and backend are reachable. Launching browser...");

    driver = await withTimeout(
      buildDriver(),
      driverStartupTimeoutMs,
      `Chrome WebDriver startup timed out after ${driverStartupTimeoutMs}ms`
    );

    await driver.manage().setTimeouts({
      pageLoad: timeoutMs,
      script: timeoutMs,
      implicit: 0,
    });

    console.log("Running: register password mismatch test");
    await clearSessionStorage(driver);
    await testRegisterPasswordMismatch(driver);

    console.log("Running: register and login success test");
    await clearSessionStorage(driver);
    await testRegisterAndLoginSuccess(driver);

    console.log("Running: login invalid credentials test");
    await clearSessionStorage(driver);
    await testLoginInvalidCredentials(driver);

    console.log("All Selenium login/register tests passed.");
  } catch (error) {
    console.error("Selenium login/register tests failed:");
    console.error(error?.stack || error);
    console.error(
      "Tip: run `npm run test:e2e:local` to auto-start backend and frontend before Selenium."
    );
    process.exitCode = 1;
  } finally {
    clearInterval(keepAlive);

    if (driver) {
      await driver.quit();
    }
  }
};

main();
