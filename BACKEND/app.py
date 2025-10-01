from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend to access backend

@app.route("/")
def home():
    return jsonify({"message": "Welcome to UNCP Navigate API 🚀"})

@app.route("/buildings")
@app.route("/buildings")
def get_buildings():
    buildings = [
        # --- Administration / Academic ---
        {"name": "Dr. Joseph B. Oxendine Administration", "type": "Administration", "lat": 34.6889, "lng": -79.2015},
        {"name": "Lumbee Hall", "type": "Administration", "lat": 34.6886, "lng": -79.2010},
        {"name": "Business Administration Building", "type": "Academic", "lat": 34.6893, "lng": -79.2007},
        {"name": "Dial Humanities Building", "type": "Academic", "lat": 34.6884, "lng": -79.1999},
        {"name": "Education Building", "type": "Academic", "lat": 34.6880, "lng": -79.1992},
        {"name": "James A. Thomas Hall", "type": "Academic", "lat": 34.6896, "lng": -79.2003},
        {"name": "Sampson Academic Building", "type": "Academic", "lat": 34.6877, "lng": -79.1996},
        {"name": "Oxendine Science Building", "type": "Academic", "lat": 34.6891, "lng": -79.1998},
        {"name": "Mary Livermore Library", "type": "Library", "lat": 34.6881, "lng": -79.2001},
        {"name": "Moore Hall", "type": "Academic", "lat": 34.6888, "lng": -79.1989},
        {"name": "Locklear Hall", "type": "Academic", "lat": 34.6879, "lng": -79.1988},
        {"name": "Weinstein Health Sciences Building", "type": "Academic", "lat": 34.6894, "lng": -79.1984},
        {"name":"DF Lowry Building /Centre For Students Success / CSS","type":"Academic","lat":34.6887,"lng":-79.1985},

        # --- Student Life / Services ---
        {"name": "James B. Chavis Student Center", "type": "Student Life", "lat": 34.6874, "lng": -79.1994},
        {"name": "University Center Annex", "type": "Student Life", "lat": 34.6872, "lng": -79.1997},
        {"name": "Brave Station / Auxiliary Services", "type": "Student Services", "lat": 34.6869, "lng": -79.1992},
        {"name": "Brave Health Center", "type": "Student Services", "lat": 34.6868, "lng": -79.2000},
        {"name": "Old Main", "type": "Historic / Student Services", "lat": 34.6882, "lng": -79.1982},

        # --- Dining (Food Spots) ---
        {"name": "Papa John's (inside Einstein Building)", "type": "Dining", "lat": 34.6883, "lng": -79.1993},
        {"name": "Chick-fil-A (inside Chavis Student Center)", "type": "Dining", "lat": 34.6874, "lng": -79.1994},
        {"name": "Starbucks (inside DF Lowry Building)", "type": "Dining", "lat": 34.6887, "lng": -79.1985},

        # --- Residence Halls & Apartments ---
        {"name": "Belk Residence Hall", "type": "Residence Hall", "lat": 34.6899, "lng": -79.2012},
        {"name": "Cypress Residence Hall", "type": "Residence Hall", "lat": 34.6895, "lng": -79.2005},
        {"name": "North Residence Hall", "type": "Residence Hall", "lat": 34.6903, "lng": -79.2009},
        {"name": "Oak Residence Hall", "type": "Residence Hall", "lat": 34.6901, "lng": -79.2001},
        {"name": "Pine Residence Hall", "type": "Residence Hall", "lat": 34.6897, "lng": -79.1997},
        {"name": "Hickory Hall", "type": "Residence Hall", "lat": 34.6905, "lng": -79.2014},
        {"name": "Hickory Hall North", "type": "Residence Hall", "lat": 34.6907, "lng": -79.2016},
        {"name": "University Courtyard Apartments (B4)", "type": "Apartments", "lat": 34.6912, "lng": -79.2007},
        {"name": "University Courtyard Apartments (B5)", "type": "Apartments", "lat": 34.6915, "lng": -79.2009},

        # --- Athletics / Fitness ---
        {"name": "English E. Jones Health & PE Center", "type": "Fitness / Gym", "lat": 34.6859, "lng": -79.2005},
        {"name": "Caton Fieldhouse", "type": "Athletics", "lat": 34.6856, "lng": -79.2008},
        {"name": "Sue Walsh Swimming Pool", "type": "Aquatics / Fitness", "lat": 34.6860, "lng": -79.2002},
        {"name": " Grace P. Johnson Stadium", "type": "Athletics", "lat": 34.6839, "lng": -79.2009},
        {"name": "LREMC Soccer Field", "type": "Athletics", "lat": 34.6848, "lng": -79.1998},
        {"name": "Sammy Cox Baseball Field", "type": "Athletics", "lat": 34.6846, "lng": -79.2014},
        {"name": "UNCP Softball Field", "type": "Athletics", "lat": 34.6843, "lng": -79.2002},
        {"name": "Tennis & Pickleball Courts", "type": "Athletics", "lat": 34.6852, "lng": -79.1989},
        {"name": "Intramural Field", "type": "Recreation", "lat": 34.6910, "lng": -79.1992},

        # --- Performing Arts / Auditoriums ---
        {"name": "Givens Performing Arts Center (GPAC)", "type": "Performing Arts / Auditorium", "lat": 34.6890, "lng": -79.1978},

        # --- Other / Landmarks ---
        {"name": "The Quad (Water Feature, Amphitheatre, Clock Tower)", "type": "Landmark", "lat": 34.6885, "lng": -79.1990},
    ]
    return jsonify(buildings)


if __name__ == "__main__":
    app.run(debug=True)
