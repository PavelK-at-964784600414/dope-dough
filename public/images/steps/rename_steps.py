import os

# Path to the folder with your images
folder = "./"

for i in range(1, 17):  # 1–16 inclusive
    old_name = os.path.join(folder, f"{i}.jpg")
    new_name = os.path.join(folder, f"step-{i}.jpg")
    if os.path.exists(old_name):
        os.rename(old_name, new_name)
        print(f"Renamed: {old_name} → {new_name}")
    else:
        print(f"File not found: {old_name}")
