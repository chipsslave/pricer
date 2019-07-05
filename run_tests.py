import datetime

from src.browser.scraper_bots.argos.argos import Argos
from src.browser.scraper_bots.boots.boots import Boots
from src.browser.scraper_bots.debenhams.debenhams_watches import DebenhamsWatchesShop
from src.browser.scraper_bots.fragranceshop.fragranceshop import FragranceShop
from src.browser.scraper_bots.hsamuel.hsamuel import HSamuelShop
from src.browser.scraper_bots.johnlewis.johnlewis_watches import JohnLewisWatchesShop
from src.browser.scraper_bots.watches2u.watches2u import Watches2uShop
from src.browser.scraper_bots.watchshop.watchshopshop import WatchShopShop
from src.browser.webdriver import WebDriver

web_driver = WebDriver()
web_driver.go_to('https://www.argos.co.uk/browse/technology/video-games-and-consoles/nintendo-switch/nintendo-switch-games/c:30292/opt/page:6/')

now = datetime.datetime.now()
date, time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
Argos(driver=web_driver.driver, store_id=1, date=date, time=time).process_items()
