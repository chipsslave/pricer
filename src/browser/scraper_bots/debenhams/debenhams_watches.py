import datetime
from time import sleep

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys

from src.browser.scraper_bots.debenhams.debenhams_item import DebenhamsItem


class DebenhamsWatchesShop(object):
    def __init__(self, driver, store_id, date, time):
        self.driver = driver
        self.store_id = store_id
        self.date = date
        self.time = time

    @property
    def item_boxes(self):
        class_name = 't-product-list__product'
        elements = self.driver.find_elements_by_class_name(class_name)
        print(len(elements))
        for item in elements:
            yield item

    def scrape_products(self):

        # CSS paths
        name_css = 'div > article > div > div.u-display-inline-block.u-width-full > a > div'
        prices_css = 'div > article > div > div:nth-child(2) > div.dbh-now.u-text-weight-bold.u-color-neutral-70 > span'
        price_class = ''
        prices_css_2 = ''
        url_class = ''

        image_css = 'div > article > a > div > img'
        href_css = 'div > article > a'
        promo_class = ''

        for item in self.item_boxes:
            try:
                title = item.find_element_by_css_selector(name_css).text
                item_image = item.find_element_by_css_selector(image_css).get_attribute('src')
                url = item.find_element_by_css_selector(href_css).get_attribute('href')
                store_product_id = url.split('prod_')[1]
                price = float(item.find_element_by_css_selector(prices_css).text)
                promo = None
                promo_url = None

                item = DebenhamsItem(title, price, store_product_id, url, item_image, self.store_id, self.date, self.time, promo, promo_url)
                #print(item)
            except:
                continue
            yield item

    def process_items(self):
        while True:
            curr_page = self.driver.current_url
            print(curr_page)
            sleep(2)
            self.driver.find_element_by_tag_name('html').send_keys(Keys.END)
            for item in self.scrape_products():
                item.evaluate()
            next_page = self.nex_page()
            if next_page is not None:
                next_page.click()
            else:
                break

    def test_run(self):
        while True:
            for item in self.scrape_products():
                continue
                #item.evaluate()
            #break
            self.nex_page()
            # if self.next_page() is not None:
            #     print(self.next_page())
            #     self.driver.get(self.next_page())
            #     now = datetime.datetime.now()
            #     self.date, self.time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
            # elif self.next_page() is None:
            #     break

    def test_run2(self):
        while True:
            curr_page = self.driver.current_url
            print(curr_page)
            sleep(2)
            self.driver.find_element_by_tag_name('html').send_keys(Keys.END)
            for item in self.scrape_products():
                continue
            next_page = self.nex_page()
            if next_page is not None:
                next_page.click()
            else:
                break

    def nex_page(self):
        button_next_page = '#app-main > div > div > div.t-product-list__side-filter-container.t-product-list__side-filter-container-no-results-container > div:nth-child(2) > div > div.t-product-list__result-list-wrapper > div.t-product-list__container.dbh-product-list > div.c-product-control-bar.c-product-control-bar--bottom > div > nav > button.pw-button.pw--icon-only.pw-pagination__next.pw-pagination__button.dbh-next.u-flexbox.u-align-center'

        # self.driver.find_element_by_tag_name('html').send_keys(Keys.END)
        # sleep(0.5)
        pagination = self.driver.find_element_by_css_selector(button_next_page)

        if pagination.is_enabled():
            return pagination
        else:
            return None
            # element = next_page.find_element_by_tag_name('a').get_attribute('href')
            # next_page.find_element_by_tag_name('a').click()

        # except NoSuchElementException:
        #     element = None
        #     return element
