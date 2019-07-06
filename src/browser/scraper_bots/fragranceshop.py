import datetime
from time import sleep

from src.browser.scraper_bots.ShopItem import ShopItem


class FragranceShop(object):
    def __init__(self, driver, store_id, date, time):
        self.driver = driver
        self.store_id = store_id
        self.date = date
        self.time = time

    @property
    def item_boxes(self):
        div_class = 'c-product-grid'
        element = self.driver.find_element_by_class_name(div_class)
        for item in element.find_elements_by_tag_name("li"):
            yield item

    def scrape_products(self):

        # CSS paths
        name_css = 'a > div > div:nth-child(2)'
        prices_css = 'div > div.c-product-grid__product-item__price.ng-binding'
        price_class = 'product_price'
        prices_css_2 = ''
        url_class = 'product_name_link'

        image_css = 'a > div > div.c-product-grid__product-item__img-wrapper > img'
        href_css = 'a'
        promo_class = 'plp-promotion-redesign'

        for num, item in enumerate(self.item_boxes):
            try:
                title = item.find_element_by_css_selector(image_css).get_attribute('alt')
                item_image = item.find_element_by_css_selector(image_css).get_attribute('src')
                url = item.find_element_by_css_selector(href_css).get_attribute('href')
                store_product_id = url.split('-')[-1].split('.')[0]
                price = float(item.find_element_by_css_selector(prices_css).text[1:])
                promo = None
                promo_url = None
            except:
                continue
            item = ShopItem(title, price, store_product_id, url, item_image, self.store_id, self.date, self.time, promo,
                            promo_url)
            #print(item)
            yield item

    def process_items(self):
        while True:
            for item in self.scrape_products():
                if item is not None:
                    item.evaluate()
            if self.nex_page() is not None:
                self.nex_page().click()
                sleep(2)
                now = datetime.datetime.now()
                self.date, self.time = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")
            elif self.nex_page() is None:
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

    def nex_page(self):
        #pagination_buttons = '//*[@id="findability"]/div/div[4]/div[1]/div[2]/ul/li'
        pagination_css = '#estore_Pagination_template_container > ul'
        pagination_class = 'pagination__list'
        last_button_class = 'current_state_right'
        xpath = '//*[@id="estore_Pagination_template_container"]/ul'
        css_selector = '#mp-pusher > div.container.container-minheight > div.ng-scope > div:nth-child(3) > div.u-border-left.u-border-none\@mobile.u-border-colour--1000.o-layout__item.u-12\/12\@mobile.u-12\/12\@tablet.u-9\/12\@desktop > div.u-12\/12.u-text--right > div > ul > li:nth-child(6) > a'
        pagination = '#mp-pusher > div.container.container-minheight > div.ng-scope > div:nth-child(3) > div.u-border-left.u-border-none\@mobile.u-border-colour--1000.o-layout__item.u-12\/12\@mobile.u-12\/12\@tablet.u-9\/12\@desktop > div.u-12\/12.u-text--right > div > ul'
        #try:
        pagination = self.driver.find_element_by_css_selector(pagination)
        pagination_elements = pagination.find_elements_by_tag_name("li")
        next_page = pagination_elements[-1]
        if next_page.get_attribute('title') == 'Next Page':
            self.driver.execute_script("arguments[0].scrollIntoView();", next_page)
            return next_page
        else:
            return None
            # element = next_page.find_element_by_tag_name('a').get_attribute('href')
            # next_page.find_element_by_tag_name('a').click()

        # except NoSuchElementException:
        #     element = None
        #     return element
