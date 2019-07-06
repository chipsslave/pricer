import datetime

from selenium.common.exceptions import NoSuchElementException

from src.browser.scraper_bots.ShopItem import ShopItem


class WatchShopShop(object):
    def __init__(self, driver, store_id, date, time):
        self.driver = driver
        self.store_id = store_id
        self.date = date
        self.time = time

    @property
    def item_boxes(self):
        element_css = '#AUTODIV_ecommcategoryphtml > div.main-content.listing-content.container-fluid.primary-border > div > div.listing-products-container > div.listing-products-inner > div.row.listing-products'
        class_name = 'listing-product'
        element = self.driver.find_element_by_css_selector(element_css)
        for item in element.find_elements_by_class_name(class_name):
            yield item

    def scrape_products(self):

        # CSS paths
        rating_css = ''

        title_css = 'div:nth-child(9) > div.listing-product-name > p'
        price_css = 'div:nth-child(9) > div.price.sale-price.price-listing-page > div.d-inline'
        price_class = ''
        price_css_w_rating = ''
        product_id = '#AUTODIV_ecommcategoryphtml > div.main-content.listing-content.container-fluid.primary-border > div > div.listing-products-container > div.listing-products-inner > div.row.listing-products > div:nth-child(1)'
        product_url = 'div:nth-child(9) > div.listing-product-image > a:nth-child(1)'
        img_src_class = 'listing-product-image'

        for item in self.item_boxes:
            store_product_id = item.get_attribute('data-id')
            title = item.find_element_by_css_selector(title_css).get_attribute('title').strip()

            try:
                price = float(item.find_element_by_css_selector(price_css).get_attribute('content'))
            except NoSuchElementException:
                price = float(item.find_element_by_class_name('d-inline').get_attribute('content'))
            item_image = item.find_element_by_class_name('listing-product-image').find_element_by_class_name('img-fluid').get_attribute('src')
            if item_image.endswith('.gif'):
                item_image = None
            url = item.find_element_by_class_name(img_src_class).find_element_by_css_selector('a:nth-child(1)').get_attribute('href')
            item = ShopItem(title, price, store_product_id, url, item_image, self.store_id, self.date, self.time)
            #print(item)
            yield item

    def test_run(self):
        while True:
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            parts = int(last_height / 200)
            for x in range(parts):
                self.driver.execute_script("window.scrollTo(0, {});".format(x * 200))

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
        pagination_buttons_class = 'listing-product-bottom'
        try:
            pagination_elements = self.driver.find_element_by_class_name(pagination_buttons_class)
            pagination_elements = pagination_elements.find_elements_by_tag_name('a')
            last_element = pagination_elements[-2]
            element = last_element.get_attribute('title')
            if element == 'Next page':
                return last_element.get_attribute('href')
        except (NoSuchElementException, IndexError):
            element = None
            return element
