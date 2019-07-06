# pricer

Technologies used for the project are Selenium and MySQL.

Project is being built around object-oriented programming principles.

How it works:
1. Program searches database for a URL which last time was checked longer than two hours ago.
2. Browser is initiated with a found URL
3. Items found on the web are checked against the items within the database to compare the prices.
4. If changes are found new prices are stored into the database

Purpose:
Be the first one to spot significant item price changes and keep a history of these changes which allows investigation of sudden price drop.

Example of a good deal:
![Good](https://github.com/chipsslave/pricer/blob/cleaning_shop_item/img/good_deal.PNG)
Example of a not so good deal:
![Bad](https://github.com/chipsslave/pricer/blob/cleaning_shop_item/img/not_so_good_deal.PNG)
Example of a weird deal:
![Weird](https://github.com/chipsslave/pricer/blob/cleaning_shop_item/img/weird_deal.PNG)
