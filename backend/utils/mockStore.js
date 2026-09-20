import slugify from "./slugify.js";

export const initialGenres = [
  {
    "_id": "67d4f0010000000000000001",
    "name": "Action",
    "slug": "action",
    "description": "High-octane stunts, battles and heroic quests.",
    "image": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000002",
    "name": "Sci-Fi",
    "slug": "sci-fi",
    "description": "Futuristic innovation, dimensional exploration and AI.",
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000003",
    "name": "Drama",
    "slug": "drama",
    "description": "Deep human stories and unforgettable journeys.",
    "image": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000004",
    "name": "Thriller",
    "slug": "thriller",
    "description": "Gripping suspense, plot twists and mysteries.",
    "image": "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000005",
    "name": "Comedy",
    "slug": "comedy",
    "description": "Laughs, satire and heartwarming moments.",
    "image": "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000006",
    "name": "Horror",
    "slug": "horror",
    "description": "Chilling supernatural encounters and dark suspense.",
    "image": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000007",
    "name": "Romance",
    "slug": "romance",
    "description": "Heartfelt romance and profound connections.",
    "image": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    "featured": false
  },
  {
    "_id": "67d4f0010000000000000008",
    "name": "Animation",
    "slug": "animation",
    "description": "Visual artistry and fantasy worlds.",
    "image": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    "featured": true
  }
];

export const initialMovies = [
  {
    "_id": "67d4f0020000000000000001",
    "tmdbId": "10331",
    "title": "Night of the Living Dead",
    "originalTitle": "Night of the Living Dead",
    "slug": "night-of-the-living-dead-1968",
    "description": "A ragtag group of Pennsylvanians barricade themselves in an old farmhouse to remain safe from a bloodthirsty, flesh-eating breed of reanimated ghouls. A timeless masterpiece of cinema in the Public Domain.",
    "poster": "https://image.tmdb.org/t/p/w500/inHGJg2Y8oQdE9w583o17o2hYxL.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w500/inHGJg2Y8oQdE9w583o17o2hYxL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/oX2H92fO9R4U3X6h7jNfM8sK0o1.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/oX2H92fO9R4U3X6h7jNfM8sK0o1.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=0TAGtE_8wHQ",
    "trailerEmbed": "https://www.youtube-nocookie.com/embed/0TAGtE_8wHQ?autoplay=1",
    "watchUrl": "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4",
    "downloadUrl": "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead.mp4",
    "videoUrl": "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4",
    "contentType": "movie",
    "availability": "PUBLIC_DOMAIN",
    "officialSources": [
      {
        "providerName": "Internet Archive (Public Domain)",
        "logoUrl": "https://archive.org/images/ia-logo.svg",
        "type": "free",
        "url": "https://archive.org/details/night_of_the_living_dead",
        "price": "Free / Public Domain"
      },
      {
        "providerName": "FILMVORA Free Stream",
        "logoUrl": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=92&q=80",
        "type": "free",
        "url": "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead.mp4",
        "price": "Free Full HD"
      }
    ],
    "genre": "Horror",
    "genres": [
      "Horror",
      "Mystery",
      "Thriller"
    ],
    "language": "English",
    "languages": [
      "English"
    ],
    "country": "United States",
    "releaseYear": 1968,
    "releaseDate": "1968-10-01",
    "duration": "96 min",
    "runtime": 96,
    "rating": 8.8,
    "director": "George A. Romero",
    "cast": [
      "Duane Jones",
      "Judith ODea",
      "Karl Hardman",
      "Marilyn Eastman"
    ],
    "castDetails": [
      {
        "name": "Duane Jones",
        "character": "Ben",
        "profileUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=185&q=80"
      },
      {
        "name": "Judith ODea",
        "character": "Barbra",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&q=80"
      }
    ],
    "ageRating": "16+",
    "quality": "1080p Full HD",
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 452100,
    "tags": [
      "public domain",
      "horror",
      "zombies",
      "classic",
      "free to watch"
    ]
  },
  {
    "_id": "67d4f0020000000000000002",
    "tmdbId": "138833",
    "title": "Tears of Steel",
    "originalTitle": "Tears of Steel",
    "slug": "tears-of-steel-2012",
    "description": "Set in a dystopian future Amsterdam, a group of scientists and warriors attempt to stage a desperate intervention using time-bending technology to save humanity from robot domination. Created by the Blender Foundation under Creative Commons.",
    "poster": "https://image.tmdb.org/t/p/w500/uU84L8kU3m3tqE2E3f3Z4h5K6w.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w500/uU84L8kU3m3tqE2E3f3Z4h5K6w.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/pP4gC6c4bE7yH8zF1kK9x3A2V.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/pP4gC6c4bE7yH8zF1kK9x3A2V.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=R6MlUcmOul8",
    "trailerEmbed": "https://www.youtube-nocookie.com/embed/R6MlUcmOul8?autoplay=1",
    "watchUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "downloadUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "videoUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "contentType": "movie",
    "availability": "CREATIVE_COMMONS",
    "officialSources": [
      {
        "providerName": "Blender Open Movie Project",
        "logoUrl": "https://mango.blender.org/wp-content/themes/mango/images/logo.png",
        "type": "free",
        "url": "https://mango.blender.org",
        "price": "Free CC-BY"
      },
      {
        "providerName": "FILMVORA 4K Stream",
        "logoUrl": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=92&q=80",
        "type": "free",
        "url": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
        "price": "Free"
      }
    ],
    "genre": "Sci-Fi",
    "genres": [
      "Sci-Fi",
      "Action",
      "Short"
    ],
    "language": "English",
    "languages": [
      "English",
      "Dutch"
    ],
    "country": "Netherlands",
    "releaseYear": 2012,
    "releaseDate": "2012-09-26",
    "duration": "13 min",
    "runtime": 13,
    "rating": 8.9,
    "director": "Ian Hubert",
    "cast": [
      "Derek de Lint",
      "Sergio Hasselbaink",
      "Rogier Schippers",
      "Vanja Rukavina"
    ],
    "ageRating": "13+",
    "quality": "4K Ultra HD",
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 312000,
    "tags": [
      "creative commons",
      "sci fi",
      "vfx",
      "robots",
      "amsterdam",
      "free"
    ]
  },
  {
    "_id": "67d4f0020000000000000003",
    "tmdbId": "22855",
    "title": "Big Buck Bunny",
    "originalTitle": "Big Buck Bunny",
    "slug": "big-buck-bunny-2008",
    "description": "A large and lovable rabbit deals with bullying forest creatures in this groundbreaking open-source 3D computer-animated comedy film by the Blender Institute.",
    "poster": "https://image.tmdb.org/t/p/w500/1XddMr7I22eXh2bF9VqQx2Q7G2N.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w500/1XddMr7I22eXh2bF9VqQx2Q7G2N.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/b33nnKl1GSFbao8l3urDDZe4KH4.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/b33nnKl1GSFbao8l3urDDZe4KH4.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=YE7VzlLtp-4",
    "trailerEmbed": "https://www.youtube-nocookie.com/embed/YE7VzlLtp-4?autoplay=1",
    "watchUrl": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    "downloadUrl": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    "videoUrl": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    "contentType": "movie",
    "availability": "CREATIVE_COMMONS",
    "officialSources": [
      {
        "providerName": "Peach Open Movie Project",
        "logoUrl": "https://peach.blender.org/wp-content/themes/peach/images/logo.png",
        "type": "free",
        "url": "https://peach.blender.org",
        "price": "Free CC-BY"
      }
    ],
    "genre": "Animation",
    "genres": [
      "Animation",
      "Comedy",
      "Family"
    ],
    "language": "English",
    "languages": [
      "No Spoken Dialogue"
    ],
    "country": "Netherlands",
    "releaseYear": 2008,
    "releaseDate": "2008-04-10",
    "duration": "10 min",
    "runtime": 10,
    "rating": 8.5,
    "director": "Sacha Goedegebure",
    "cast": [
      "Big Buck Bunny",
      "Frank the Flying Squirrel",
      "Rinky",
      "Gamera"
    ],
    "ageRating": "All Ages",
    "quality": "4K Ultra HD",
    "isFeatured": true,
    "isTrending": false,
    "isPublished": true,
    "views": 890000,
    "tags": [
      "animation",
      "comedy",
      "family",
      "creative commons",
      "free"
    ]
  },
  {
    "_id": "67d4f0020000000000000004",
    "tmdbId": "45380",
    "title": "Sintel",
    "originalTitle": "Sintel",
    "slug": "sintel-2010",
    "description": "A lonely young woman named Sintel embarks on a dangerous and emotional quest across desolate lands to rescue a baby dragon she befriended and named Scales.",
    "poster": "https://image.tmdb.org/t/p/w500/2L2fC2z8eG0FfV1x3x2.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w500/2L2fC2z8eG0FfV1x3x2.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    "trailerEmbed": "https://www.youtube-nocookie.com/embed/eRsGyueVLvQ?autoplay=1",
    "watchUrl": "https://archive.org/download/Sintel/sintel-2048-surround.mp4",
    "downloadUrl": "https://archive.org/download/Sintel/sintel-2048-surround.mp4",
    "videoUrl": "https://archive.org/download/Sintel/sintel-2048-surround.mp4",
    "contentType": "movie",
    "availability": "CREATIVE_COMMONS",
    "officialSources": [
      {
        "providerName": "Durian Open Movie Project",
        "logoUrl": "https://durian.blender.org/wp-content/themes/durian/images/logo.png",
        "type": "free",
        "url": "https://durian.blender.org",
        "price": "Free CC-BY"
      }
    ],
    "genre": "Animation",
    "genres": [
      "Animation",
      "Fantasy",
      "Adventure",
      "Drama"
    ],
    "language": "English",
    "languages": [
      "English"
    ],
    "country": "Netherlands",
    "releaseYear": 2010,
    "releaseDate": "2010-09-27",
    "duration": "15 min",
    "runtime": 15,
    "rating": 8.7,
    "director": "Colin Levy",
    "cast": [
      "Halina Reijn",
      "Thom Hoffman"
    ],
    "ageRating": "13+",
    "quality": "4K Ultra HD",
    "isFeatured": false,
    "isTrending": true,
    "isPublished": true,
    "views": 640000,
    "tags": [
      "animation",
      "fantasy",
      "dragon",
      "epic",
      "creative commons",
      "free"
    ]
  },
  {
    "_id": "67d4f0020000000000000005",
    "tmdbId": "791373",
    "title": "Pushpa 2: The Rule",
    "originalTitle": "Pushpa 2: The Rule",
    "slug": "pushpa-2-the-rule",
    "description": "Pushpa Raj solidifies his rule over the red sandalwood empire while facing ferocious retribution from SP Bhanwar Singh Shekhawat in this epic high-voltage action saga.",
    "poster": "https://image.tmdb.org/t/p/w500/1XddMr7I22eXh2bF9VqQx2Q7G2N.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w500/1XddMr7I22eXh2bF9VqQx2Q7G2N.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/b33nnKl1GSFbao8l3urDDZe4KH4.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/b33nnKl1GSFbao8l3urDDZe4KH4.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=1kVK0MZlbI4",
    "trailerEmbed": "https://www.youtube-nocookie.com/embed/1kVK0MZlbI4?autoplay=1",
    "contentType": "movie",
    "availability": "EXTERNAL_STREAMING",
    "officialSources": [
      {
        "providerName": "Netflix",
        "logoUrl": "https://image.tmdb.org/t/p/w92/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg",
        "type": "stream",
        "url": "https://www.netflix.com",
        "price": "Subscription"
      },
      {
        "providerName": "BookMyShow Stream",
        "logoUrl": "https://image.tmdb.org/t/p/w92/1d6s7zW7E2kE4l5b2p3f.jpg",
        "type": "rent",
        "url": "https://in.bookmyshow.com",
        "price": "Rent"
      }
    ],
    "genre": "Action",
    "genres": [
      "Action",
      "Crime",
      "Drama"
    ],
    "language": "Hindi",
    "languages": [
      "Telugu",
      "Hindi",
      "Tamil",
      "Malayalam",
      "Kannada"
    ],
    "country": "India",
    "releaseYear": 2024,
    "releaseDate": "2024-12-05",
    "duration": "201 min",
    "runtime": 201,
    "rating": 9.4,
    "director": "Sukumar",
    "cast": [
      "Allu Arjun",
      "Rashmika Mandanna",
      "Fahadh Faasil",
      "Jagapathi Babu"
    ],
    "castDetails": [
      {
        "name": "Allu Arjun",
        "character": "Pushpa Raj",
        "profileUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=185&q=80"
      },
      {
        "name": "Rashmika Mandanna",
        "character": "Srivalli",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&q=80"
      },
      {
        "name": "Fahadh Faasil",
        "character": "SP Bhanwar Singh",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&q=80"
      }
    ],
    "ageRating": "16+",
    "quality": "4K Ultra HD",
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 1485200,
    "tags": [
      "pushpa",
      "pushpa 2",
      "allu arjun",
      "bollywood",
      "south indian",
      "action",
      "where to watch"
    ]
  },
  {
    "_id": "67d4f0020000000000000006",
    "tmdbId": "1022789",
    "title": "Stree 2: Sarkate Ka Aatank",
    "originalTitle": "Stree 2",
    "slug": "stree-2",
    "description": "The peaceful town of Chanderi is terrorized by a gruesome new headless villain named Sarkata. Vicky, Bittu, Jana and Rudra reunite with the mysterious guardian Stree to defeat the entity.",
    "poster": "https://image.tmdb.org/t/p/w500/1XddMr7I22eXh2bF9VqQx2Q7G2N.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w500/1XddMr7I22eXh2bF9VqQx2Q7G2N.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/stree2_backdrop.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/stree2_backdrop.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=KVn5p6tGv_0",
    "trailerEmbed": "https://www.youtube-nocookie.com/embed/KVn5p6tGv_0?autoplay=1",
    "contentType": "movie",
    "availability": "EXTERNAL_STREAMING",
    "officialSources": [
      {
        "providerName": "Amazon Prime Video",
        "logoUrl": "https://image.tmdb.org/t/p/w92/emthp39XA2zhcoYLhp9de9EICXD.jpg",
        "type": "stream",
        "url": "https://www.primevideo.com",
        "price": "Included with Prime"
      },
      {
        "providerName": "Apple TV",
        "logoUrl": "https://image.tmdb.org/t/p/w92/peURlLlr8jggOwK53fJ5wdQl05y.jpg",
        "type": "rent",
        "url": "https://tv.apple.com",
        "price": "Rent / Buy"
      }
    ],
    "genre": "Comedy",
    "genres": [
      "Comedy",
      "Horror",
      "Mystery"
    ],
    "language": "Hindi",
    "languages": [
      "Hindi"
    ],
    "country": "India",
    "releaseYear": 2024,
    "releaseDate": "2024-08-15",
    "duration": "147 min",
    "runtime": 147,
    "rating": 8.9,
    "director": "Amar Kaushik",
    "cast": [
      "Rajkummar Rao",
      "Shraddha Kapoor",
      "Pankaj Tripathi",
      "Abhishek Banerjee"
    ],
    "ageRating": "13+",
    "quality": "4K Ultra HD",
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 2341000,
    "tags": [
      "stree 2",
      "shraddha kapoor",
      "rajkummar rao",
      "horror comedy",
      "bollywood",
      "where to watch"
    ]
  },
  {
    "_id": "67d4f0020000000000000007",
    "tmdbId": "799583",
    "title": "Kalki 2898 AD",
    "originalTitle": "Kalki 2898 AD",
    "slug": "kalki-2898-ad",
    "description": "In the post-apocalyptic dystopian desert city of Kasi in 2898 AD, the immortal warrior Ashwatthama awakens to protect the unborn savior child SUM-80 from the ruthless tyrant Supreme Yaskin.",
    "poster": "https://image.tmdb.org/t/p/w500/872585.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w500/872585.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/kalki_backdrop.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/kalki_backdrop.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=kQDd1AhGIHk",
    "trailerEmbed": "https://www.youtube-nocookie.com/embed/kQDd1AhGIHk?autoplay=1",
    "contentType": "movie",
    "availability": "EXTERNAL_STREAMING",
    "officialSources": [
      {
        "providerName": "Netflix (Hindi)",
        "logoUrl": "https://image.tmdb.org/t/p/w92/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg",
        "type": "stream",
        "url": "https://www.netflix.com",
        "price": "Subscription"
      },
      {
        "providerName": "Amazon Prime Video (South)",
        "logoUrl": "https://image.tmdb.org/t/p/w92/emthp39XA2zhcoYLhp9de9EICXD.jpg",
        "type": "stream",
        "url": "https://www.primevideo.com",
        "price": "Subscription"
      }
    ],
    "genre": "Sci-Fi",
    "genres": [
      "Sci-Fi",
      "Action",
      "Fantasy"
    ],
    "language": "Hindi",
    "languages": [
      "Telugu",
      "Hindi",
      "Tamil",
      "Malayalam",
      "Kannada"
    ],
    "country": "India",
    "releaseYear": 2024,
    "releaseDate": "2024-06-27",
    "duration": "181 min",
    "runtime": 181,
    "rating": 9.1,
    "director": "Nag Ashwin",
    "cast": [
      "Prabhas",
      "Amitabh Bachchan",
      "Deepika Padukone",
      "Kamal Haasan"
    ],
    "ageRating": "13+",
    "quality": "4K Ultra HD",
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 1984000,
    "tags": [
      "kalki",
      "prabhas",
      "amitabh bachchan",
      "sci fi",
      "bollywood",
      "south indian",
      "where to watch"
    ]
  },
  {
    "_id": "67d4f0020000000000000008",
    "tmdbId": "533535",
    "title": "Deadpool & Wolverine",
    "originalTitle": "Deadpool & Wolverine",
    "slug": "deadpool-and-wolverine",
    "description": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary behind him. But when the Time Variance Authority recruits him, he seeks out a weary Wolverine to save his universe.",
    "poster": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/yDHYTfaSK9EUUMf93uj1ndvmcu.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/yDHYTfaSK9EUUMf93uj1ndvmcu.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=73_1biulkYk",
    "trailerEmbed": "https://www.youtube-nocookie.com/embed/73_1biulkYk?autoplay=1",
    "contentType": "movie",
    "availability": "EXTERNAL_STREAMING",
    "officialSources": [
      {
        "providerName": "Disney+ Hotstar",
        "logoUrl": "https://image.tmdb.org/t/p/w92/7rwgQI5a3BpEgismY0BQLL9fDrN.jpg",
        "type": "stream",
        "url": "https://www.hotstar.com",
        "price": "Subscription"
      },
      {
        "providerName": "Apple TV",
        "logoUrl": "https://image.tmdb.org/t/p/w92/peURlLlr8jggOwK53fJ5wdQl05y.jpg",
        "type": "rent",
        "url": "https://tv.apple.com",
        "price": "Rent / Buy"
      }
    ],
    "genre": "Action",
    "genres": [
      "Action",
      "Comedy",
      "Sci-Fi"
    ],
    "language": "English",
    "languages": [
      "English",
      "Hindi Dub"
    ],
    "country": "United States",
    "releaseYear": 2024,
    "releaseDate": "2024-07-26",
    "duration": "128 min",
    "runtime": 128,
    "rating": 8.8,
    "director": "Shawn Levy",
    "cast": [
      "Ryan Reynolds",
      "Hugh Jackman",
      "Emma Corrin",
      "Matthew Macfadyen"
    ],
    "ageRating": "16+",
    "quality": "4K Ultra HD",
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 3100000,
    "tags": [
      "deadpool",
      "wolverine",
      "marvel",
      "mcu",
      "hollywood",
      "action",
      "where to watch"
    ]
  },
  {
    "_id": "67d4f0020000000000000009",
    "tmdbId": "83867",
    "title": "Mirzapur (Season 3)",
    "originalTitle": "Mirzapur",
    "slug": "mirzapur-season-3",
    "description": "With Kaleen Bhaiya missing and Munna dead, Guddu Pandit and Golu fight desperately to hold onto the throne of Purvanchal against bloodthirsty contenders.",
    "poster": "https://image.tmdb.org/t/p/w500/dCzYJ3z5w6eQ8r8dK9f0g1.jpg",
    "posterUrl": "https://image.tmdb.org/t/p/w500/dCzYJ3z5w6eQ8r8dK9f0g1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/original/mirzapur_backdrop.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/mirzapur_backdrop.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=0k5G6FmK_Xo",
    "trailerEmbed": "https://www.youtube-nocookie.com/embed/0k5G6FmK_Xo?autoplay=1",
    "contentType": "tv",
    "availability": "EXTERNAL_STREAMING",
    "officialSources": [
      {
        "providerName": "Amazon Prime Video",
        "logoUrl": "https://image.tmdb.org/t/p/w92/emthp39XA2zhcoYLhp9de9EICXD.jpg",
        "type": "stream",
        "url": "https://www.primevideo.com",
        "price": "Prime Exclusive"
      }
    ],
    "genre": "Drama",
    "genres": [
      "Crime",
      "Drama",
      "Action"
    ],
    "language": "Hindi",
    "languages": [
      "Hindi"
    ],
    "country": "India",
    "releaseYear": 2024,
    "releaseDate": "2024-07-05",
    "duration": "3 Seasons",
    "runtime": 300,
    "rating": 9.3,
    "director": "Gurmmeet Singh",
    "cast": [
      "Pankaj Tripathi",
      "Ali Fazal",
      "Shweta Tripathi",
      "Rasika Dugal",
      "Vijay Varma"
    ],
    "ageRating": "18+",
    "quality": "4K Ultra HD",
    "isFeatured": false,
    "isTrending": true,
    "isPublished": true,
    "views": 4500000,
    "tags": [
      "mirzapur",
      "guddu",
      "kaleen bhaiya",
      "web series",
      "hindi",
      "where to watch"
    ]
  }
];

export const initialReviews = [
  {
    _id: "67d4f0030000000000000001",
    movie: "67d4f0020000000000000001",
    userName: "Rahul Verma",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    rating: 10,
    comment: "A legendary horror classic in crisp high definition! Love that FILMVORA offers legal public domain streaming.",
    createdAt: new Date().toISOString(),
  }
];

export const inMemoryStore = {
  genres: [...initialGenres],
  movies: [...initialMovies],
  reviews: [...initialReviews],
  users: [
    {
      _id: "67d4f0040000000000000001",
      name: "Filmvora Admin",
      email: "admin@filmvora.com",
      role: "admin",
      isPremium: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date().toISOString(),
    }
  ],
  settings: {
    siteName: "FILMVORA",
    siteTagline: "Legal Movie Discovery, OTT Guide & Free Classics Streaming",
    enableRegistrations: true,
    enableReviews: true,
    enableAds: true,
    affiliateLinksEnabled: true,
  }
};
