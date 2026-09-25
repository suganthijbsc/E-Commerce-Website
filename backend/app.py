from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

CORS(app)


# =================================
# MYSQL DATABASE CONNECTION
# =================================

def get_db_connection():

    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="suganthi2003",
        database="ecommerce_db"
    )

    return connection


# =================================
# HOME API
# =================================

@app.route("/")
def home():

    return "ShopEase Backend is Running!"


# =================================
# DATABASE TEST API
# =================================

@app.route("/test-db")
def test_db():

    try:

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute("SELECT 1")

        result = cursor.fetchone()

        cursor.close()

        connection.close()

        return {
            "status": "success",
            "message": "MySQL Connected Successfully!",
            "result": result[0]
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }

# =================================
# PRODUCTS API
# =================================

@app.route("/api/products")
def get_products():

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM Products")

        products = cursor.fetchall()

        cursor.close()

        connection.close()

        return products

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }

# =================================
# ADD PRODUCT TO CART
# =================================

@app.route("/api/cart", methods=["POST"])
def add_cart():

    try:

        data = request.get_json()

        product_id = data.get("product_id")
        quantity = data.get("quantity", 1)

        if not product_id:
            return {
                "status": "error",
                "message": "Product ID is required"
            }, 400

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # Check whether product already exists in cart
        cursor.execute(
            """
            SELECT * FROM cart
            WHERE Product_ID = %s
            """,
            (product_id,)
        )

        existing_product = cursor.fetchone()

        if existing_product:

            # Increase quantity
            new_quantity = (
                existing_product["Quantity"] + quantity
            )

            cursor.execute(
                """
                UPDATE cart
                SET Quantity = %s
                WHERE Product_ID = %s
                """,
                (new_quantity, product_id)
            )

        else:

            # Add new product
            cursor.execute(
                """
                INSERT INTO cart
                (Product_ID, Quantity)
                VALUES (%s, %s)
                """,
                (product_id, quantity)
            )

        connection.commit()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "message": "Product added to cart!",
            "product_id": product_id,
            "quantity": quantity
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

 # =================================
# GET CART
# =================================

@app.route("/api/cart", methods=["GET"])
def get_cart():

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                c.Cart_ID,
                c.Product_ID,
                c.Quantity,
                p.Product_Name,
                p.Category,
                p.Price
            FROM cart c
            JOIN products p
                ON c.Product_ID = p.Product_ID
            """
        )

        cart_items = cursor.fetchall()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "cart": cart_items
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

        # =================================
# UPDATE CART QUANTITY
# =================================

@app.route("/api/cart/update", methods=["PUT"])
def update_cart():

    try:

        data = request.get_json()

        cart_id = data.get("Cart_ID")
        quantity = data.get("Quantity")

        if not cart_id or quantity is None:
            return {
                "status": "error",
                "message": "Cart_ID and Quantity are required"
            }, 400

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE cart
            SET Quantity = %s
            WHERE Cart_ID = %s
            """,
            (quantity, cart_id)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "message": "Cart quantity updated successfully"
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

        # =================================
# REMOVE CART ITEM
# =================================

@app.route("/api/cart/remove/<int:cart_id>", methods=["DELETE"])
def remove_cart_item(cart_id):

    try:

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM cart
            WHERE Cart_ID = %s
            """,
            (cart_id,)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "message": "Item removed from cart"
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500


        # =================================
# ADD PRODUCT TO CART
# =================================

@app.route("/api/cart/add", methods=["POST"])
def add_to_cart():

    try:

        data = request.get_json()

        product_id = data.get("Product_ID")
        quantity = data.get("Quantity", 1)

        if not product_id:
            return {
                "status": "error",
                "message": "Product_ID is required"
            }, 400

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # Check whether product exists
        cursor.execute(
            """
            SELECT Product_ID
            FROM products
            WHERE Product_ID = %s
            """,
            (product_id,)
        )

        product = cursor.fetchone()

        if not product:

            cursor.close()
            connection.close()

            return {
                "status": "error",
                "message": "Product not found"
            }, 404

        # Check existing cart item
        cursor.execute(
            """
            SELECT Cart_ID, Quantity
            FROM cart
            WHERE Product_ID = %s
            """,
            (product_id,)
        )

        existing_item = cursor.fetchone()

        if existing_item:

            new_quantity = (
                existing_item["Quantity"] + quantity
            )

            cursor.execute(
                """
                UPDATE cart
                SET Quantity = %s
                WHERE Cart_ID = %s
                """,
                (
                    new_quantity,
                    existing_item["Cart_ID"]
                )
            )

        else:

            cursor.execute(
                """
                INSERT INTO cart
                (Product_ID, Quantity)
                VALUES (%s, %s)
                """,
                (
                    product_id,
                    quantity
                )
            )

        connection.commit()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "message": "Product added to cart successfully"
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

# =================================
# PLACE ORDER
# =================================

@app.route("/api/orders", methods=["POST"])
def place_order():

    try:

        data = request.get_json()

        customer_id = data.get("Customer_ID")

        if not customer_id:
            return {
                "status": "error",
                "message": "Customer_ID is required"
            }, 400

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # ---------------------------------
        # CHECK CUSTOMER
        # ---------------------------------

        cursor.execute(
            """
            SELECT Customer_ID
            FROM customers
            WHERE Customer_ID = %s
            """,
            (customer_id,)
        )

        customer = cursor.fetchone()

        if not customer:

            cursor.close()
            connection.close()

            return {
                "status": "error",
                "message": "Customer not found"
            }, 404

        # ---------------------------------
        # GET CART
        # ---------------------------------

        cursor.execute(
            """
            SELECT Product_ID, Quantity
            FROM cart
            """
        )

        cart_items = cursor.fetchall()

        if not cart_items:

            cursor.close()
            connection.close()

            return {
                "status": "error",
                "message": "Cart is empty"
            }, 400

        # ---------------------------------
        # GENERATE ORDER ID
        # ---------------------------------

        cursor.execute(
            """
            SELECT Order_ID
            FROM orders
            ORDER BY CAST(SUBSTRING(Order_ID, 2) AS UNSIGNED) DESC
            LIMIT 1
            """
        )

        last_order = cursor.fetchone()

        if last_order:

            last_id = int(
                last_order["Order_ID"][1:]
            )

            new_order_id = "O" + str(
                last_id + 1
            ).zfill(5)

        else:

            new_order_id = "O0001"

        # ---------------------------------
        # INSERT ORDER
        # ---------------------------------

        cursor.execute(
            """
            INSERT INTO orders
            (
                Order_ID,
                Customer_ID,
                Order_Date,
                Order_Status
            )
            VALUES
            (
                %s,
                %s,
                CURDATE(),
                %s
            )
            """,
            (
                new_order_id,
                customer_id,
                "Pending"
            )
        )

        # ---------------------------------
        # GET LAST ORDER DETAIL ID
        # ---------------------------------

        cursor.execute(
            """
            SELECT Order_Detail_ID
            FROM order_details
            ORDER BY CAST(SUBSTRING(Order_Detail_ID, 3) AS UNSIGNED) DESC
            LIMIT 1
            """
        )

        last_detail = cursor.fetchone()

        if last_detail:

            last_detail_id = int(
                last_detail["Order_Detail_ID"][2:]
            )

        else:

            last_detail_id = 0

        # ---------------------------------
        # INSERT ORDER DETAILS
        # ---------------------------------

        for item in cart_items:

            last_detail_id += 1

            order_detail_id = "OD" + str(
                last_detail_id
            ).zfill(5)

            cursor.execute(
                """
                INSERT INTO order_details
                (
                    Order_Detail_ID,
                    Order_ID,
                    Product_ID,
                    Quantity
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s
                )
                """,
                (
                    order_detail_id,
                    new_order_id,
                    item["Product_ID"],
                    item["Quantity"]
                )
            )

        # ---------------------------------
        # CLEAR CART
        # ---------------------------------

        cursor.execute(
            """
            DELETE FROM cart
            """
        )
        print("Cart rows deleted:", cursor.rowcount)
        connection.commit()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "message": "Order placed successfully",
            "Order_ID": new_order_id,
            "Customer_ID": customer_id,
            "Order_Status": "Pending"
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500


# =================================
# GET CUSTOMER ORDERS
# =================================

@app.route("/api/orders/<customer_id>", methods=["GET"])
def get_customer_orders(customer_id):

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                Order_ID,
                Customer_ID,
                Order_Date,
                Order_Status
            FROM orders
            WHERE Customer_ID = %s
            ORDER BY Order_Date DESC, Order_ID DESC
            """,
            (customer_id,)
        )

        orders = cursor.fetchall()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "orders": orders
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

# =================================
# GET ORDER DETAILS
# =================================

@app.route("/api/orders/<order_id>/details", methods=["GET"])
def get_order_details(order_id):

    try:
        print("GET ORDER DETAILS ROUTE HIT:", order_id)
        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                od.Order_Detail_ID,
                od.Order_ID,
                od.Product_ID,
                p.Product_Name,
                od.Quantity,
                p.Price
            FROM order_details od
            JOIN products p
                ON od.Product_ID = p.Product_ID
            WHERE od.Order_ID = %s
            """,
            (order_id,)
        )

        details = cursor.fetchall()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "details": details
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

# =================================
# CANCEL ORDER
# =================================

@app.route("/api/orders/<order_id>/cancel", methods=["PUT"])
def cancel_order(order_id):

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # Check order

        cursor.execute(
            """
            SELECT Order_ID, Order_Status
            FROM orders
            WHERE Order_ID = %s
            """,
            (order_id,)
        )

        order = cursor.fetchone()

        if not order:

            cursor.close()
            connection.close()

            return {
                "status": "error",
                "message": "Order not found"
            }, 404

        # Allow cancellation only for Pending orders

        if order["Order_Status"] != "Pending":

            cursor.close()
            connection.close()

            return {
                "status": "error",
                "message": "Only Pending orders can be cancelled"
            }, 400

        # Update status

        cursor.execute(
            """
            UPDATE orders
            SET Order_Status = 'Cancelled'
            WHERE Order_ID = %s
            """,
            (order_id,)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "message": "Order cancelled successfully",
            "Order_ID": order_id,
            "Order_Status": "Cancelled"
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

# =================================
# LOGIN
# =================================

@app.route("/api/login", methods=["POST"])
def login():

    try:

        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:

            return {
                "status": "error",
                "message": "Email and password are required"
            }, 400

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                User_ID,
                Customer_ID,
                Email,
                Password
            FROM users
            WHERE Email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        cursor.close()
        connection.close()

        if not user:

            return {
                "status": "error",
                "message": "Invalid email or password"
            }, 401

        if user["Password"] != password:

            return {
                "status": "error",
                "message": "Invalid email or password"
            }, 401

        return {
            "status": "success",
            "message": "Login successful",
            "Customer_ID": user["Customer_ID"],
            "Email": user["Email"]
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

# =================================
# REGISTER / SIGNUP
# =================================

@app.route("/api/register", methods=["POST"])
def register():

    try:

        data = request.get_json()

        customer_id = data.get("Customer_ID")
        email = data.get("email")
        password = data.get("password")

        if not customer_id or not email or not password:
            return {
                "status": "error",
                "message": "All fields are required"
            }, 400


        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)


        # Check Customer ID
        cursor.execute("""
            SELECT Customer_ID
            FROM customers
            WHERE Customer_ID = %s
        """, (customer_id,))

        customer = cursor.fetchone()

        if not customer:

            cursor.close()
            connection.close()

            return {
                "status": "error",
                "message": "Customer ID not found"
            }, 404


        # Check existing email
        cursor.execute("""
            SELECT User_ID
            FROM users
            WHERE Email = %s
        """, (email,))

        existing_user = cursor.fetchone()

        if existing_user:

            cursor.close()
            connection.close()

            return {
                "status": "error",
                "message": "Email already registered"
            }, 409


        # Create user
        cursor.execute("""
            INSERT INTO users
            (Customer_ID, Email, Password)
            VALUES (%s, %s, %s)
        """, (customer_id, email, password))


        connection.commit()

        cursor.close()
        connection.close()


        return {
            "status": "success",
            "message": "Account created successfully"
        }


    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

# =================================
# RUN SERVER
# =================================

if __name__ == "__main__":

    app.run(debug=True)