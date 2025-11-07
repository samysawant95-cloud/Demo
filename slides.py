import json
import random


slide = '''<div class="swiper-slide" data-bg-image="{game_image}" data-parallax="image">
	<div class="container">
		<div class="slider-content-two" data-animate="fadeIn">

			<h2 data-animate="fadeInUp"><span>{game_genre}</span> Game :</h2>
			<h2 data-animate="fadeInUp" data-delay="0.5s">{game_name}</h2>

			<a href="{game_path}" class="popup-btn" data-animate="fadeInRight" data-delay="0.9s">
				<i class="fa fa-play"></i>
				Play
			</a>

		</div>
		<!-- /.slider-content -->
	</div>
	<!-- /.container -->
</div>'''

with open("Nserve_75HTML5_Games.json", 'r') as f:
    game_data = json.loads(f.read())

hd_images = [
    "images/barbie cooking.png",
    "images/sw arcade.png",
    "images/barbie-sparkle-mountain-ride.png",
    "images/swr team tactics.png",
]

slides = ""

for i in game_data:
    if i.get("image") in hd_images:
        slides += slide.format(
            game_image=i.get('image', ''),
            game_genre=i.get("genre", ""),
            game_name=i.get("name", ""),
            game_path=i.get('path', ''),
        )

with open("slides.html", 'w') as f:
    f.write(slides)
