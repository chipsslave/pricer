from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# TODO: allow multiple instances of driver to run at the same time
#   Currently drivers will pick up same URL


class WebDriver(object):
    def __init__(self):
        chrome_options = Options()
        root_folder = Path(__file__).parents[2]
        chrome_driver = root_folder / "chromedriver.exe"
        chrome_driver = str(chrome_driver)
        #chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(executable_path=chrome_driver,
                                       chrome_options=chrome_options, keep_alive=True)
        self.driver.maximize_window()

    def go_to(self, url):
        print("Accessing: {}".format(url))
        self.driver.get(url)

    def __del__(self):
        self.driver.quit()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.driver.quit()