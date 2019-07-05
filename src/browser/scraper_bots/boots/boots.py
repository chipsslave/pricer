import datetime

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By

from src.browser.scraper_bots.boots.boots_item import BootsItem


class Boots(object):
    def __init__(self, driver, store_id, date, time):
        self.driver = driver
        self.store_id = store_id
        self.date = date
        self.time = time

    @property
    def item_boxes(self):
        div_class = 'plp_gridView_redesign'
        id = 'dijit__WidgetBase_0'
        element = self.driver.find_element_by_class_name(div_class).find_element_by_tag_name('ul')
        for item in element.find_elements_by_tag_name("li"):
            yield item

    def scrape_products(self):

        # CSS paths
        name_css = ''
        prices_css = ''
        price_class = 'product_price'
        prices_css_2 = ''
        url_class = 'product_name_link'

        image_css = 'img'

        promo_class = 'plp-promotion-redesign'

        for item in self.item_boxes:
            title = item.find_element_by_css_selector(image_css).get_attribute('alt')
            price = float(item.find_element_by_class_name(price_class).text[1:])
            url = item.find_element_by_class_name(url_class).get_attribute('href')

            store_product_id = int(url.split('-')[-1])

            item_image = item.find_element_by_css_selector(image_css).get_attribute('src')
            try:
                promo = item.find_element_by_class_name(promo_class).text
                promo_url = None
            except:
                promo = None
                promo_url = None

            item = BootsItem(title, price, store_product_id, url, item_image, 3, self.date, self.time, promo, promo_url)
            print(item)
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
                continue
                #item.evaluate()
            self.nex_page()
            # if self.next_page() is not None:
            #     print(self.next_page())
            #     self.driver.get(self.next_page())
            #     now = datetime.datetime.now()
            #     self.date, self.time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
            # elif self.next_page() is None:
            #     break

    def nex_page(self):
        #pagination_buttons = '//*[@id="findability"]/div/div[4]/div[1]/div[2]/ul/li'
        pagination_css = '#estore_Pagination_template_container > ul'
        pagination_class = 'pagination__list'
        last_button_class = 'current_state_right'
        xpath = '//*[@id="estore_Pagination_template_container"]/ul'
        try:
            pagination = self.driver.find_element_by_css_selector(pagination_css)
            pagination_elements = pagination.find_elements_by_tag_name("li")
            next_page = pagination_elements[-1]
            element = next_page.find_element_by_tag_name('a').get_attribute('href')
            next_page.find_element_by_tag_name('a').click()
            self.driver.refresh()
        except NoSuchElementException:
            element = None
            return element
