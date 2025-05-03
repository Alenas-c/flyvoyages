from app import create_app, db
from app.models import AdminUser
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_db():
    app = create_app()
    with app.app_context():
        # Check if admin user exists
        admin = AdminUser.query.filter_by(
            username=os.getenv('ADMIN_USERNAME')
        ).first()
        
        if not admin:
            # Create admin user
            admin = AdminUser(
                username=os.getenv('ADMIN_USERNAME'),
                email=os.getenv('ADMIN_EMAIL'),
                password=os.getenv('ADMIN_PASSWORD')
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists.")

if __name__ == '__main__':
    init_db() 