import datetime

from src.browser.scraper_bots.argos import Argos
from src.browser.webdriver import WebDriver

web_driver = WebDriver()
web_driver.go_to('https://www.argos.co.uk/browse/technology/video-games-and-consoles/nintendo-switch/nintendo-switch-games/c:30292/opt/page:6/')

now = datetime.datetime.now()
date, time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
Argos(driver=web_driver.driver, store_id=1, date=date, time=time).process_items()
