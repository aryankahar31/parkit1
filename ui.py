import tkinter as tk
from tkinter import ttk

# Function to update the parking status of the boxes
def update_parking_status(box_index, is_occupied):
    color = "red" if is_occupied else "green"
    parking_boxes[box_index].config(bg=color)

# Function to navigate to the parking status page
def show_parking_status():
    home_frame.pack_forget()
    parking_frame.pack(pady=10)

# Function to go back to the home page
def show_home():
    parking_frame.pack_forget()
    home_frame.pack(pady=10)

# Set up the main window
root = tk.Tk()
root.title("Parkit App")
root.geometry("400x700")  # Width x Height

# Create a style object
style = ttk.Style()
style.theme_use('clam')  # Choose a ttk theme

# Create a menu bar
menu_bar = tk.Menu(root)
root.config(menu=menu_bar)

# Add "Home" and "Parking Status" options to the menu
menu_bar.add_command(label="Home", command=show_home)
menu_bar.add_command(label="Parking Status", command=show_parking_status)

# Create the home page frame
home_frame = tk.Frame(root)
home_frame.pack(pady=10)

# Add a label and a search bar to the home page
home_label = tk.Label(home_frame, text="Welcome to Parkit", font=("Helvetica", 18))
home_label.pack(pady=10)

search_label = tk.Label(home_frame, text="Find Parking Near You:", font=("Helvetica", 14))
search_label.pack(pady=5)

search_bar = ttk.Entry(home_frame, width=30)
search_bar.pack(pady=5)

# Placeholder for map (this can be replaced with an actual map in the future)
map_placeholder = tk.Label(home_frame, text="Map Placeholder", width=30, height=10, bg="lightgrey")
map_placeholder.pack(pady=10)

# Create the parking status frame (initially hidden)
parking_frame = tk.Frame(root)

# Create a label for the parking status
status_label = tk.Label(parking_frame, text="Parking Status", font=("Helvetica", 16))
status_label.pack(pady=20)

# Create frames for parking boxes
parking_boxes = []
for i in range(6):
    box = ttk.Frame(parking_frame, width=300, height=50, style='TFrame')  # Use the defined style
    box.pack(pady=10)  # Add space between boxes
    parking_boxes.append(box)

# Simulated parking status (for testing purposes)
# Change the status of the parking boxes manually here (True for occupied, False for available)
update_parking_status(0, True)  # Box 1 is occupied
update_parking_status(1, False)  # Box 2 is available
update_parking_status(2, False)  # Box 3 is available
update_parking_status(3, True)  # Box 4 is occupied
update_parking_status(4, False)  # Box 5 is available
update_parking_status(5, True)  # Box 6 is occupied

# Create a button to refresh the status (you can customize this later)
refresh_button = ttk.Button(parking_frame, text="Refresh Parking Status", command=lambda: None)
refresh_button.pack(pady=10)

# Show the home page by default
show_home()

# Run the application
root.mainloop()