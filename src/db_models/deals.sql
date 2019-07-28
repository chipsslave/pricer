SELECT item.*, price.*, lPrice.*
FROM items AS item
INNER JOIN (
SELECT
	price.item_id AS itemID,
	MAX(price) AS maxPrice,
	MIN(price) AS minPrice,
	ROUND(AVG(price), 2) AS avgPrice,
	MAX(id) AS maxID,
	ROUND((1 - MIN(price) / MAX(price)) * 100, 1) AS totalDelta
FROM item_prices AS price
GROUP BY itemID
) AS price
ON
item.id = price.itemID AND item.id = price.itemID

INNER JOIN (
SELECT
	lPrice.id AS ID,
	lPrice.item_id AS itemID,
	lPrice.price AS lastPrice,
	`date` AS priceDate,
	`time` AS priceTime
FROM item_prices AS lPrice
WHERE id IN (
    SELECT MAX(id)
    FROM item_prices
    GROUP BY item_id
)
) AS lPrice
ON item.id = lPrice.itemID

WHERE lPrice.lastPrice = price.minPrice
AND lPrice.lastPrice <> price.maxPrice
AND price.totalDelta > 19.9
AND price.maxPrice > 30
AND item.title NOT LIKE "%Xbox%"
AND item.title NOT LIKE "%PS4%"
AND item.title NOT LIKE "%Switch%"

ORDER BY lPrice.priceDate DESC
