from selenium import webdriver
from selenium.webdriver.chrome.options import Options


class WebDriver(object):
    def __init__(self):
        chrome_options = Options()
        #chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(executable_path='C:/python/chromedriver.exe',
                                       chrome_options=chrome_options, keep_alive=True)
        self.driver.maximize_window()

    def go_to(self, url):
        print("Accessing: {}".format(url))
        self.driver.get(url)

    def __del__(self):
        self.driver.quit()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.driver.quit()