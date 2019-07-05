import datetime
from time import sleep

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains

from src.browser.scraper_bots.argos.argos_item import ArgosItem
from src.browser.scraper_bots.watchshop.watchshop_item import WatchShopItem


class Watches2uShop(object):
    def __init__(self, driver, store_id, date, time):
        self.driver = driver
        self.store_id = store_id
        self.date = date
        self.time = time

    @property
    def item_boxes(self):
        class_name = 'xcomponent_products_medium'
        for item in self.driver.find_elements_by_class_name(class_name):
            yield item

    def scrape_products(self):

        # CSS paths
        rating_css = ''

        title_css = 'div:nth-child(9) > div.listing-product-name > p'
        price_css = 'div:nth-child(9) > div.price.sale-price.price-listing-page > div.d-inline'
        price_class = 'xcomponent_products_medium_price'
        price_css_w_rating = ''
        product_id = 'div'
        product_url = 'a'
        img_src_css = 'a > img'

        for item in self.item_boxes:
            stock = item.find_element_by_class_name('xcomponent_products_medium_instock').text.strip()
            if stock != 'Out of Stock':
                url = item.find_element_by_css_selector(product_url).get_attribute('href')
                item_image = item.find_element_by_css_selector(img_src_css).get_attribute('src')
                title = item.find_element_by_css_selector(img_src_css).get_attribute('title')

                try:
                    price = float(item.find_element_by_class_name(price_class).find_element_by_class_name('flashdeal').text[1:])
                except NoSuchElementException:
                    pass

                try:
                    price = float(item.find_element_by_class_name(price_class).find_element_by_class_name('sale').text[1:])
                except NoSuchElementException:
                    pass

                try:
                    price = float(item.find_element_by_class_name(price_class).find_element_by_class_name('price').text[1:])
                except NoSuchElementException:
                    pass

                store_product_id = url.split('/')[-1]
                print(price, store_product_id, title)
                print(url)
                print(item_image)
                # item = WatchShopItem(title, price, store_product_id, url, item_image, self.store_id, self.date, self.time)
                # print(item)
                yield item

    def test_run(self):
        while True:
            for item in self.scrape_products():
                continue

            if self.nex_page() is not None:
                print(self.nex_page())
                self.driver.get(self.nex_page())
                now = datetime.datetime.now()
                self.date, self.time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
            elif self.nex_page() is None:
                break

    def process_items(self):
        while True:
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            parts = int(last_height / 200)
            for x in range(parts):
                self.driver.execute_script("window.scrollTo(0, {});".format(x * 200))

            for item in self.scrape_products():
                item.evaluate()

            if self.nex_page() is not None:
                print(self.nex_page())
                self.driver.get(self.nex_page())
                now = datetime.datetime.now()
                self.date, self.time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
            elif self.nex_page() is None:
                break

    def nex_page(self):
        try:
            next_page = self.driver.find_element_by_class_name('next')
            current_url = self.driver.current_url
            current_page = int(self.split(current_url, '=', 2)[1])
            next_page = current_page + 1
            next_page = self.split(current_url, '=', 2)[0] + '=' + str(next_page)
            return next_page
        except NoSuchElementException:
            return None

    def cur_page_number(self):
        current_url = self.driver.current_url
        current_page = int(current_url.split('=')[-1])
        return current_page

    def split(self, string, sep, pos):
        string = string.split(sep)
        return sep.join(string[:pos]), sep.join(string[pos:])