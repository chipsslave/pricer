import datetime
from time import sleep

from src.browser.scraper_bots.argos import Argos
from src.browser.scraper_bots.debenhams_watches import DebenhamsWatchesShop
from src.browser.scraper_bots.ernestjones import ErnestJonesShop
from src.browser.scraper_bots.fragranceshop import FragranceShop
from src.browser.scraper_bots.hsamuel import HSamuelShop
from src.browser.scraper_bots.superdrug import Superdrug
from src.browser.scraper_bots.watchshopshop import WatchShopShop
from src.browser.webdriver import WebDriver
from src.db_models.store_urls import StoreURL

web_driver = None

while True:
    store_url = StoreURL.select_oldest()
    print(store_url)
    print('Current time: ', datetime.datetime.utcnow())
    print('Plus 60 minutes: ', store_url.utc_time() + datetime.timedelta(minutes=120))
    if store_url.utc_time() + datetime.timedelta(minutes=120) < datetime.datetime.utcnow():
        print('URL older than 20 minutes\n{}'.format(store_url.url))
        if web_driver is None:
            web_driver = WebDriver()

        future = datetime.datetime.now() + datetime.timedelta(minutes=15)
        date, time = future.strftime("%Y-%m-%d"), future.strftime("%H:%M")
        store_url.update_lc_date_time(date, time)

        web_driver.go_to(store_url.url)

        now = datetime.datetime.now()
        date, time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")

        if store_url.store_id == 1:
            try:
                Argos(driver=web_driver.driver, store_id=store_url.store_id, date=date, time=time).process_items()
                store_url.update_lc_date_time(date, time)
            except:
                future = datetime.datetime.now() + datetime.timedelta(minutes=15)
                date, time = future.strftime("%Y-%m-%d"), future.strftime("%H:%M")
                store_url.update_lc_date_time(date, time)
                continue
        elif store_url.store_id == 2:
            try:
                Superdrug(driver=web_driver.driver, store_id=store_url.store_id, date=date, time=time).process_items()
                store_url.update_lc_date_time(date, time)
            except:
                future = datetime.datetime.now() + datetime.timedelta(minutes=15)
                date, time = future.strftime("%Y-%m-%d"), future.strftime("%H:%M")
                store_url.update_lc_date_time(date, time)
                continue
        elif store_url.store_id == 3:
            try:
                sleep(2)
                FragranceShop(driver=web_driver.driver, store_id=store_url.store_id, date=date, time=time).process_items()
                store_url.update_lc_date_time(date, time)
            except:
                future = datetime.datetime.now() + datetime.timedelta(minutes=15)
                date, time = future.strftime("%Y-%m-%d"), future.strftime("%H:%M")
                store_url.update_lc_date_time(date, time)
                continue
        elif store_url.store_id == 4:
            try:
                HSamuelShop(driver=web_driver.driver, store_id=store_url.store_id, date=date, time=time).process_items()
                store_url.update_lc_date_time(date, time)
            except:
                future = datetime.datetime.now() + datetime.timedelta(minutes=15)
                date, time = future.strftime("%Y-%m-%d"), future.strftime("%H:%M")
                store_url.update_lc_date_time(date, time)
                continue
        elif store_url.store_id == 5:
            try:
                DebenhamsWatchesShop(driver=web_driver.driver, store_id=store_url.store_id, date=date, time=time).process_items()
                store_url.update_lc_date_time(date, time)
            except:
                future = datetime.datetime.now() + datetime.timedelta(minutes=15)
                date, time = future.strftime("%Y-%m-%d"), future.strftime("%H:%M")
                store_url.update_lc_date_time(date, time)
                continue
        elif store_url.store_id == 6:
            try:
                ErnestJonesShop(driver=web_driver.driver, store_id=store_url.store_id, date=date, time=time).process_items()
                store_url.update_lc_date_time(date, time)
            except:
                future = datetime.datetime.now() + datetime.timedelta(minutes=15)
                date, time = future.strftime("%Y-%m-%d"), future.strftime("%H:%M")
                store_url.update_lc_date_time(date, time)
                continue
        elif store_url.store_id == 7:
            try:
                WatchShopShop(driver=web_driver.driver, store_id=store_url.store_id, date=date, time=time).process_items()
                store_url.update_lc_date_time(date, time)
            except:
                future = datetime.datetime.now() + datetime.timedelta(minutes=15)
                date, time = future.strftime("%Y-%m-%d"), future.strftime("%H:%M")
                store_url.update_lc_date_time(date, time)
                continue
    else:
        web_driver = None
        print('Sleeping for 500s')
        sleep(500)
