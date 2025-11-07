import os
import json
from thefuzz import fuzz
import pandas as pd


def get_ratio(folder_name: str, folder_names: list):
    ratio = 0
    matching_ratio = 90

    for title in folder_names:
        ratio = fuzz.ratio(folder_name, title)
        if ratio >= matching_ratio:
            return (ratio, title)

    return (ratio, None)


def get_file_path_of_games(df: pd.DataFrame) -> pd.DataFrame:
    game_dir = "games"
    # List all folder names in the "games" directory
    folder_names = os.listdir(game_dir)
    missing_games = []

    # Initialize a new column "path" with None
    df['path'] = None

    # Iterate over each row in the DataFrame
    for idx, row in df.iterrows():
        name = row['name']
        image = row['image']
        ratio, folder_name = get_ratio(name, folder_names)
        # Check if the name matches any folder name
        if ratio and folder_name:
            # Construct the full path
            folder_path = f"../games/{folder_name}/index.html"
            image_path = f"images/{image}"
            # Store the path in the DataFrame
            df.at[idx, 'path'] = folder_path

            df.at[idx, 'name'] = folder_name
            df.at[idx, 'image'] = image_path
        else:
            missing_games.append(name)

    print(f"Missing Games Count: {len(missing_games)}")
    with open("missing games.json", "w") as f:
        json.dump(missing_games, f)

    return df


if __name__ == '__main__':

    # Load the Excel file
    xlsx_file = "Nserve 75HTML5_Games.xlsx"
    df = pd.read_excel(
        xlsx_file,
        engine='openpyxl',
        sheet_name='Selected Games'
    )

    df.rename(columns={
        "Title": "name",
        "Genre": "genre",
        "IP Producer(s)": "producer",
        "Visual ": "image",
    }, inplace=True)

    # Strip whitespace from each column
    df = df.map(lambda x: x.strip() if isinstance(x, str) else x)

    df = get_file_path_of_games(df)

    df.to_excel("nserve_75_html_games(fixed).xlsx", index=False)

    # Convert the DataFrame to JSON
    json_data = df.to_json(orient='records', indent=4)

    # Save the JSON to a file
    json_file = "Nserve_75HTML5_Games.json"

    with open(json_file, "w") as file:
        file.write(json_data)

    print("JSON file created successfully.")
