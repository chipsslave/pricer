import datetime

from selenium.common.exceptions import NoSuchElementException

from src.browser.scraper_bots.ShopItem import ShopItem


class Superdrug(object):
    def __init__(self, driver, store_id, date, time):
        self.driver = driver
        self.store_id = store_id
        self.date = date
        self.time = time

    @property
    def item_boxes(self):
        class_name = 'item__gutter'
        for item in self.driver.find_elements_by_class_name(class_name):
            yield item

    def scrape_products(self):

        # CSS paths
        name_css = 'div > div.item__text > a'
        prices_css = 'div > div.basket-add > div'
        price_class = 'items__prices'
        prices_css_2 = 'div > div.basket-add > div.items__prices'
        image_css = 'div > a > img'

        promo_class = 'item__promotion'

        for item in self.item_boxes:
            title = item.find_element_by_css_selector(image_css).get_attribute('alt')

            price = item.find_element_by_class_name(price_class)
            price_text = price.get_attribute("textContent")
            price_replace = price_text.replace('\t', '')
            price_text_split = price_replace.split('\n')
            price_text_split_sliced = price_text_split[1]
            price_text_split_sliced_price = price_text_split_sliced[1:]
            price_text_split_sliced_price_float = float(price_text_split_sliced_price)

            #price = float(price.text.split('\n')[0][1:])
            url = item.find_element_by_css_selector(name_css).get_attribute('href')
            store_product_id = int(url.split('/')[-1])
            item_image = item.find_element_by_css_selector(image_css).get_attribute('src')
            try:
                promo = item.find_element_by_class_name(promo_class).get_attribute('title')
                promo_url = item.find_element_by_class_name(promo_class).get_attribute('href')
            except:
                promo = None
                promo_url = None

            if item_image is None:
                item_image = ' https://www.superdrug.com' + item.find_element_by_css_selector(image_css).get_attribute('data-src')
            item = ShopItem(title, price_text_split_sliced_price_float, store_product_id, url, item_image,
                            self.store_id, self.date, self.time, promo, promo_url)
            #print(item)
            yield item

    def process_items(self):
        while True:
            for item in self.scrape_products():
                if item is not None:
                    item.evaluate()
            if self.nex_page() is not None:
                print(self.nex_page())
                self.driver.get(self.nex_page())
                now = datetime.datetime.now()
                self.date, self.time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
            elif self.nex_page() is None:
                break

    def test_run(self):
        while True:
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
        #pagination_buttons = '//*[@id="findability"]/div/div[4]/div[1]/div[2]/ul/li'
        pagination_css = '#plp > ul > li.next.pagination__item.direction > a'
        pagination_class = 'pagination__list'
        try:
            last_element = self.driver.find_element_by_css_selector(pagination_css)
            element = last_element.get_attribute('href')
        except (NoSuchElementException, IndexError):
            element = None
        return element
