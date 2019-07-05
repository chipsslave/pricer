import datetime

from selenium.common.exceptions import NoSuchElementException

from src.browser.scraper_bots.argos.argos_item import ArgosItem


class Argos(object):
    def __init__(self, driver, store_id, date, time):
        self.driver = driver
        self.store_id = store_id
        self.date = date
        self.time = time

    @property
    def item_boxes(self):
        class_name = 'ac-product-card'
        for item in self.driver.find_elements_by_class_name(class_name):
            yield item

    def scrape_products(self):

        # CSS paths
        rating_css = 'a.ac-product-link.ac-product-card__details > div.ac-product-card__title-and-rating > div.ac-product-card__rating > div'

        name_css_w_rating = 'a.ac-product-link.ac-product-card__details > div.ac-product-card__title > div > div'
        name_css_wo_rating = 'a.ac-product-link.ac-product-card__details > div.ac-product-card__title-and-rating > div.ac-product-card__title > div > div'
        price = 'a[2]/div[3]/div[1]/span[1]'
        price_class = 'ac-product-price__amount'
        price_css_w_rating = 'a.ac-product-link.ac-product-card__details > div.ac-product-card__prices-and-offers > div.ac-product-price.xs-row.ac-product-card__prices > span.ac-product-price__amount'
        product_id = ''
        product_url = 'a[1]'
        img_src = 'a[1]/div/div/img'
        img_src = 'a.ac-product-link.ac-product-card__image > div > div > picture > img'

        for item in self.item_boxes:
            try:
                try:
                    title = item.find_element_by_css_selector(name_css_w_rating).text
                except NoSuchElementException:
                    title = item.find_element_by_css_selector(name_css_wo_rating).text
                price = float(item.find_element_by_css_selector(price_css_w_rating).text[1:])
                store_product_id = item.get_attribute('data-product-id')
                url = item.find_element_by_xpath(product_url).get_attribute('href')
                item_image = item.find_element_by_css_selector(img_src).get_attribute('src')
                item = ArgosItem(title, price, store_product_id, url, item_image, self.store_id, self.date, self.time)
                if item.store_product_id == '8042675':
                    print('This is what was found on the web:')
                    print(item)
                yield item
            except:
                continue

    def process_items(self):
        while True:
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            parts = int(last_height / 200)
            for x in range(parts):
                self.driver.execute_script("window.scrollTo(0, {});".format(x * 200))

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

    def nex_page(self):
        pagination_buttons = '//*[@id="findability"]/div/div[4]/div[1]/div[2]/ul/li'
        try:
            pagination_elements = self.driver.find_elements_by_xpath(pagination_buttons)
            last_element = pagination_elements[-1]
            element = last_element.find_element_by_xpath('a').get_attribute('href')
        except (NoSuchElementException, IndexError):
            element = None
        return element
