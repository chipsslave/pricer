import datetime
from time import sleep

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains

from src.browser.scraper_bots.ShopItem import ShopItem


class ErnestJonesShop(object):
    def __init__(self, driver, store_id, date, time):
        self.driver = driver
        self.store_id = store_id
        self.date = date
        self.time = time

    @property
    def item_boxes(self):
        div_class = 'items'
        '#js-product-list'
        element = self.driver.find_element_by_class_name(div_class)
        for item in element.find_elements_by_tag_name("li"):
            yield item

    @property
    def items_found(self):
        div_class = 'items'
        element = self.driver.find_element_by_class_name(div_class)
        return len(element.find_elements_by_tag_name("li"))

    def scrape_products(self):

        # CSS paths
        stock_css = 'div > div > a > div:nth-child(2) > div.tablet-up > div > span'
        image_css = 'div > a.productLink.link--plain.js-nextPreviousStorage > div > img'
        title_css = 'div > div > a > div.product-tile__description'
        sku_css = 'div > meta'
        price_css = 'div > div > a > div:nth-child(2) > div.product-tile__pricing-container > div > div > p > span > span.product-tile__price-value'
        url_css = 'div > div > a'
        for item in self.item_boxes:
            stock = 'In Stock'
            try:
                try:
                    stock = item.find_element_by_css_selector(stock_css).text
                except NoSuchElementException:
                    if stock != 'Out of stock':
                        title = item.find_element_by_css_selector(title_css).text.strip()

                        if item.find_element_by_css_selector(image_css).get_attribute('src')[:5] == 'https':
                            item_image = item.find_element_by_css_selector(image_css).get_attribute('src')
                        else:
                            item_image = None

                        store_product_id = item.find_element_by_css_selector(sku_css).get_attribute('content')
                        price = float(item.find_element_by_css_selector(price_css).text)
                        url = item.find_element_by_css_selector(url_css).get_attribute('href')
                        promo, promo_url = None, None
                        item = ShopItem(title, price, store_product_id, url, item_image, self.store_id, self.date,
                                        self.time, promo, promo_url)
                        yield item
            except:
                continue

    def process_items(self):
        close_button_css = '#js-cancel'

        if self.cur_page_number() == 1:
            while self.cur_page_number() < 4:
                button = self.driver.find_element_by_css_selector('#js-load-next')
                actions = ActionChains(self.driver)
                actions.move_to_element(button).perform()
                try:
                    close_button = self.driver.find_element_by_css_selector(close_button_css)
                    close_button.click()
                    close = self.driver.find_element_by_css_selector("#js-cookie-close-icon")
                    close.click()
                except:
                    pass
                actions.click(button)
                actions.perform()
                sleep(0.5)

        while True:
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            parts = int(last_height / 200)
            for x in range(parts):
                self.driver.execute_script("window.scrollTo(0, {});".format(x * 200))

            for item in self.scrape_products():
                item.evaluate()
            if self.next_page() is not None:
                print(self.next_page())
                self.driver.get(self.next_page())
                now = datetime.datetime.now()
                self.date, self.time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
            elif self.next_page() is None:
                break

    def test2(self):
        if self.cur_page_number() == 1:
            while self.cur_page_number() < 4:
                button = self.driver.find_element_by_css_selector('#js-load-next')
                actions = ActionChains(self.driver)
                actions.move_to_element(button)
                actions.click(button)
                actions.perform()
                sleep(0.5)

        while True:
            for item in self.scrape_products():
                continue
                # item.evaluate()
            if self.next_page() is not None:
                print(self.next_page())
                self.driver.get(self.next_page())
                now = datetime.datetime.now()
                self.date, self.time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
            elif self.next_page() is None:
                break

    def test_run(self):
        if self.cur_page_number() == 1:
            while self.cur_page_number() < 4:
                button = self.driver.find_element_by_css_selector('#js-load-next')
                actions = ActionChains(self.driver)
                actions.move_to_element(button)
                actions.click(button)
                actions.perform()
                sleep(0.5)

        while True:
            for item in self.scrape_products():
                continue
                #item.evaluate()
            if self.next_page() is not None:
                print(self.next_page())
                self.driver.get(self.next_page())
                now = datetime.datetime.now()
                self.date, self.time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
            elif self.next_page() is None:
                break

    def cur_page_number(self):
        current_url = self.driver.current_url
        current_page = int(current_url.split('=')[1])
        return current_page

    def next_page(self):
        button_css = '#js-load-next'

        button = self.driver.find_element_by_css_selector(button_css)
        if button.get_attribute('class') == 'load-next':
            current_url = self.driver.current_url
            current_page = int(current_url.split('=')[1])
            next_page = current_page + 1
            next_page = current_url.split('=')[0] + '=' + str(next_page)
            return next_page
        else:
            return None

        # button_css = '#js-load-next'
        #
        # button = self.driver.find_element_by_css_selector(button_css)
        # if button.get_attribute('class') == 'load-next':
        #     current_url = self.driver.current_url
        #     current_page = int(current_url.split('=')[-1])
        #     next_page = current_page + 1
        #     next_page = self.split(current_url, '=', 2) + '=' + str(next_page)
        #     return next_page
        # else:
        #     return None

    def nex_page_once(self):
        button_css = '#js-load-next'
        close_button_css = '#js-cancel'

        button = self.driver.find_element_by_css_selector(button_css)
        while button.get_attribute('class') == 'load-next':
            actions = ActionChains(self.driver)
            try:
                close_button = self.driver.find_element_by_css_selector(close_button_css)
                actions.click(close_button)
            except:
                pass
            finally:
                actions.move_to_element(button)
                actions.click(button)
                actions.perform()
                sleep(0.5)

    @staticmethod
    def split(string, sep, pos):
        string = string.split(sep)
        return sep.join(string[:pos])# , sep.join(string[pos:])