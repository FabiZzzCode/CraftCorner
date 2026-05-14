-- =============================================================
-- CraftCorner Database Schema
-- Script  : p14052026a
-- Date    : 14-05-2026
-- DB      : PostgreSQL 16
-- =============================================================

-- -----------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: enum columns use VARCHAR for Hibernate compatibility (no implicit cast issues)

-- -----------------------------------------------------------
-- users
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL       PRIMARY KEY,
    first_name      VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password        VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20),
    profile_image   VARCHAR(500),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    is_blocked      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- roles
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id   BIGSERIAL  PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- -----------------------------------------------------------
-- user_roles  (join)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- -----------------------------------------------------------
-- categories
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    description TEXT,
    image_url   VARCHAR(500),
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- shops
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS shops (
    id              BIGSERIAL       PRIMARY KEY,
    seller_id       BIGINT          NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(200)    NOT NULL,
    description     TEXT,
    logo_url        VARCHAR(500),
    banner_url      VARCHAR(500),
    contact_email   VARCHAR(255),
    contact_phone   VARCHAR(20),
    address         TEXT,
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- products
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id               BIGSERIAL        PRIMARY KEY,
    shop_id          BIGINT           NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    category_id      BIGINT           NOT NULL REFERENCES categories(id),
    name             VARCHAR(300)     NOT NULL,
    description      TEXT,
    price            NUMERIC(12, 2)   NOT NULL CHECK (price >= 0),
    discount_price   NUMERIC(12, 2)   CHECK (discount_price >= 0),
    stock_quantity   INTEGER          NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    material         VARCHAR(200),
    production_time  VARCHAR(100),
    delivery_option  VARCHAR(200),
    status           VARCHAR(20)      NOT NULL DEFAULT 'ACTIVE',
    average_rating   NUMERIC(3, 2)    NOT NULL DEFAULT 0.00,
    review_count     INTEGER          NOT NULL DEFAULT 0,
    created_at       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- product_images
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
    id            BIGSERIAL     PRIMARY KEY,
    product_id    BIGINT        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url     VARCHAR(500)  NOT NULL,
    is_primary    BOOLEAN       NOT NULL DEFAULT FALSE,
    display_order INTEGER       NOT NULL DEFAULT 0,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- addresses
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS addresses (
    id             BIGSERIAL     PRIMARY KEY,
    user_id        BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name      VARCHAR(200)  NOT NULL,
    phone          VARCHAR(20)   NOT NULL,
    address_line1  VARCHAR(300)  NOT NULL,
    address_line2  VARCHAR(300),
    city           VARCHAR(100)  NOT NULL,
    state          VARCHAR(100),
    postal_code    VARCHAR(20),
    country        VARCHAR(100)  NOT NULL DEFAULT 'Bangladesh',
    is_default     BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- carts  (one per buyer)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS carts (
    id         BIGSERIAL  PRIMARY KEY,
    buyer_id   BIGINT     NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- cart_items
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart_items (
    id          BIGSERIAL      PRIMARY KEY,
    cart_id     BIGINT         NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id  BIGINT         NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity    INTEGER        NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price  NUMERIC(12,2)  NOT NULL,
    created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cart_id, product_id)
);

-- -----------------------------------------------------------
-- orders
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id                   BIGSERIAL       PRIMARY KEY,
    order_number         VARCHAR(50)     NOT NULL UNIQUE,
    buyer_id             BIGINT          NOT NULL REFERENCES users(id),
    shipping_address_id  BIGINT          REFERENCES addresses(id),
    subtotal             NUMERIC(12,2)   NOT NULL,
    delivery_charge      NUMERIC(12,2)   NOT NULL DEFAULT 0.00,
    total_amount         NUMERIC(12,2)   NOT NULL,
    payment_method       VARCHAR(30)     NOT NULL DEFAULT 'CASH_ON_DELIVERY',
    payment_status       VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    order_status         VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    notes                TEXT,
    created_at           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- order_items
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id             BIGSERIAL      PRIMARY KEY,
    order_id       BIGINT         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id     BIGINT         NOT NULL REFERENCES products(id),
    shop_id        BIGINT         NOT NULL REFERENCES shops(id),
    product_name   VARCHAR(300)   NOT NULL,
    product_image  VARCHAR(500),
    quantity       INTEGER        NOT NULL,
    unit_price     NUMERIC(12,2)  NOT NULL,
    total_price    NUMERIC(12,2)  NOT NULL,
    item_status    VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- payments
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id                BIGSERIAL       PRIMARY KEY,
    order_id          BIGINT          NOT NULL UNIQUE REFERENCES orders(id),
    transaction_id    VARCHAR(200),
    payment_method    VARCHAR(30)     NOT NULL,
    amount            NUMERIC(12,2)   NOT NULL,
    status            VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    payment_date      TIMESTAMP,
    gateway_response  TEXT,
    created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- reviews
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id          BIGSERIAL    PRIMARY KEY,
    product_id  BIGINT       NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    buyer_id    BIGINT       NOT NULL REFERENCES users(id),
    order_id    BIGINT       REFERENCES orders(id),
    rating      INTEGER      NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(200),
    comment     TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, buyer_id)
);

-- -----------------------------------------------------------
-- wishlist
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlist (
    id          BIGSERIAL  PRIMARY KEY,
    buyer_id    BIGINT     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  BIGINT     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (buyer_id, product_id)
);

-- -----------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_shop       ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status     ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer        ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_shop    ON order_items(shop_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart     ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product     ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_buyer      ON wishlist(buyer_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user     ON user_roles(user_id);

-- -----------------------------------------------------------
-- Seed: Roles
-- -----------------------------------------------------------
INSERT INTO roles (name) VALUES
    ('ROLE_ADMIN'),
    ('ROLE_SELLER'),
    ('ROLE_BUYER')
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------
-- Seed: Categories
-- -----------------------------------------------------------
INSERT INTO categories (name, description) VALUES
    ('Handmade Jewelry',   'Rings, necklaces, bracelets, and earrings crafted by hand'),
    ('Wooden Crafts',      'Handcrafted wooden items and decorations'),
    ('Clay & Pottery',     'Handmade clay pots, pottery, and ceramic items'),
    ('Handmade Bags',      'Handcrafted bags, purses, and pouches'),
    ('Home Decor',         'Handmade decorative items for your home'),
    ('Handmade Clothing',  'Hand-stitched and handcrafted garments'),
    ('Traditional Art',    'Traditional paintings, prints, and artworks'),
    ('Gift Items',         'Perfect handmade gifts for all occasions'),
    ('Bamboo Crafts',      'Eco-friendly bamboo handmade products'),
    ('Jute Products',      'Sustainable jute bags, mats, and decorations')
ON CONFLICT (name) DO NOTHING;
