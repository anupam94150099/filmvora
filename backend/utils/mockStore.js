import slugify from './slugify.js';

export const initialGenres = [
  {
    "_id": "67d4f0010000000000000001",
    "name": "Action",
    "slug": "action",
    "description": "High-octane adrenaline, explosive stunts, intense tactical combat and heroic journeys.",
    "image": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000002",
    "name": "Sci-Fi",
    "slug": "sci-fi",
    "description": "Futuristic technology, deep space exploration, AI revolutions and mind-bending realities.",
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000003",
    "name": "Drama",
    "slug": "drama",
    "description": "Compelling human narratives, emotional depths, moral dilemmas and poignant performances.",
    "image": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000004",
    "name": "Thriller",
    "slug": "thriller",
    "description": "Gripping suspense, psychological twists, mysterious conspiracies and breathless pacing.",
    "image": "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1200&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000005",
    "name": "Comedy",
    "slug": "comedy",
    "description": "Witty banter, hilarious misadventures, situational comedy and feel-good laughs.",
    "image": "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80",
    "featured": true
  },
  {
    "_id": "67d4f0010000000000000006",
    "name": "Horror",
    "slug": "horror",
    "description": "Chilling supernatural phenomena, psychological dread and terrifying mysteries.",
    "image": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    "featured": true
  }
];

export const initialMovies = [
  {
    "_id": "67d4f0020000000000000001",
    "title": "Pushpa 2: The Rule",
    "slug": "pushpa-2-the-rule",
    "description": "Pushpa Raj rises to rule the red sandalwood empire while facing deadly vengeance from SP Bhanwar Singh Shekhawat in an explosive confrontation.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/1XddMr7I22eXh2bF9VqQx2Q7G2N.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/b33nnKl1GSFbao8l3urDDZe4KH4.jpg",
    "trailerUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "videoUrl": "https://vidsrc.to/embed/movie/791373",
    "streamingMirrors": [
      {
        "name": "⚡ Server 1 (VidSrc Pro 4K)",
        "url": "https://vidsrc.to/embed/movie/791373",
        "type": "embed"
      },
      {
        "name": "🎬 Server 2 (VidSrc XYZ)",
        "url": "https://vidsrc.xyz/embed/movie?tmdb=791373",
        "type": "embed"
      },
      {
        "name": "🚀 Server 3 (MultiEmbed Fast)",
        "url": "https://multiembed.mov/?video_id=791373&tmdb=1",
        "type": "embed"
      },
      {
        "name": "🌐 Server 4 (EmbedSU VIP)",
        "url": "https://embed.su/embed/movie/791373",
        "type": "embed"
      },
      {
        "name": "📼 Server 5 (Direct Mirror)",
        "url": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
        "type": "video"
      }
    ],
    "releaseYear": 2024,
    "duration": "201 min",
    "rating": 9.4,
    "ageRating": "16+",
    "quality": "4K Ultra HD",
    "genre": "Action",
    "genres": [
      "Action",
      "Crime",
      "Drama"
    ],
    "director": "Sukumar",
    "cast": [
      "Allu Arjun",
      "Rashmika Mandanna",
      "Fahadh Faasil",
      "Jagapathi Babu"
    ],
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 148520,
    "tags": [
      "pushpa",
      "pushpa 2",
      "allu arjun",
      "action",
      "hindi",
      "south",
      "4k"
    ]
  },
  {
    "_id": "67d4f0020000000000000002",
    "title": "Stree 2: Sarkate Ka Aatank",
    "slug": "stree-2",
    "description": "The town of Chanderi faces a terrifying new headless evil 'Sarkata'. Vicky, Jana, Bittu and Rudra unite with the mysterious Stree to defeat him.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/1XddMr7I22eXh2bF9VqQx2Q7G2N.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/stree2_backdrop.jpg",
    "trailerUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "videoUrl": "https://vidsrc.to/embed/movie/1022789",
    "streamingMirrors": [
      {
        "name": "⚡ Server 1 (VidSrc Pro 4K)",
        "url": "https://vidsrc.to/embed/movie/1022789",
        "type": "embed"
      },
      {
        "name": "🎬 Server 2 (VidSrc XYZ)",
        "url": "https://vidsrc.xyz/embed/movie?tmdb=1022789",
        "type": "embed"
      },
      {
        "name": "🚀 Server 3 (MultiEmbed Fast)",
        "url": "https://multiembed.mov/?video_id=1022789&tmdb=1",
        "type": "embed"
      },
      {
        "name": "🌐 Server 4 (EmbedSU VIP)",
        "url": "https://embed.su/embed/movie/1022789",
        "type": "embed"
      },
      {
        "name": "📼 Server 5 (Direct Mirror)",
        "url": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
        "type": "video"
      }
    ],
    "releaseYear": 2024,
    "duration": "147 min",
    "rating": 8.9,
    "ageRating": "13+",
    "quality": "4K Ultra HD",
    "genre": "Comedy",
    "genres": [
      "Comedy",
      "Horror",
      "Mystery"
    ],
    "director": "Amar Kaushik",
    "cast": [
      "Rajkummar Rao",
      "Shraddha Kapoor",
      "Pankaj Tripathi",
      "Abhishek Banerjee"
    ],
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 234100,
    "tags": [
      "stree",
      "stree 2",
      "shraddha kapoor",
      "rajkummar rao",
      "horror comedy",
      "hindi"
    ]
  },
  {
    "_id": "67d4f0020000000000000003",
    "title": "Kalki 2898 AD",
    "slug": "kalki-2898-ad",
    "description": "In the dystopian city of Kasi in 2898 AD, an immortal warrior Ashwatthama protects the unborn divine child against the supreme dictator Supreme Yaskin.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/872585.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/kalki_backdrop.jpg",
    "trailerUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "videoUrl": "https://vidsrc.to/embed/movie/799583",
    "streamingMirrors": [
      {
        "name": "⚡ Server 1 (VidSrc Pro 4K)",
        "url": "https://vidsrc.to/embed/movie/799583",
        "type": "embed"
      },
      {
        "name": "🎬 Server 2 (VidSrc XYZ)",
        "url": "https://vidsrc.xyz/embed/movie?tmdb=799583",
        "type": "embed"
      },
      {
        "name": "🚀 Server 3 (MultiEmbed Fast)",
        "url": "https://multiembed.mov/?video_id=799583&tmdb=1",
        "type": "embed"
      },
      {
        "name": "🌐 Server 4 (EmbedSU VIP)",
        "url": "https://embed.su/embed/movie/799583",
        "type": "embed"
      },
      {
        "name": "📼 Server 5 (Direct Mirror)",
        "url": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
        "type": "video"
      }
    ],
    "releaseYear": 2024,
    "duration": "181 min",
    "rating": 9.1,
    "ageRating": "13+",
    "quality": "4K Ultra HD",
    "genre": "Sci-Fi",
    "genres": [
      "Sci-Fi",
      "Action",
      "Fantasy"
    ],
    "director": "Nag Ashwin",
    "cast": [
      "Prabhas",
      "Amitabh Bachchan",
      "Deepika Padukone",
      "Kamal Haasan"
    ],
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 198400,
    "tags": [
      "kalki",
      "kalki 2898 ad",
      "prabhas",
      "amitabh bachchan",
      "sci fi",
      "hindi",
      "telugu"
    ]
  },
  {
    "_id": "67d4f0020000000000000004",
    "title": "Deadpool & Wolverine",
    "slug": "deadpool-and-wolverine",
    "description": "Wade Wilson teams up with a reluctant Wolverine on a high-stakes mission through the multiverse to save his universe from annihilation.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/yDHYTfa2wfgpZKMufQIcxAN5Umh.jpg",
    "trailerUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "videoUrl": "https://vidsrc.to/embed/movie/533535",
    "streamingMirrors": [
      {
        "name": "⚡ Server 1 (VidSrc Pro 4K)",
        "url": "https://vidsrc.to/embed/movie/533535",
        "type": "embed"
      },
      {
        "name": "🎬 Server 2 (VidSrc XYZ)",
        "url": "https://vidsrc.xyz/embed/movie?tmdb=533535",
        "type": "embed"
      },
      {
        "name": "🚀 Server 3 (MultiEmbed Fast)",
        "url": "https://multiembed.mov/?video_id=533535&tmdb=1",
        "type": "embed"
      },
      {
        "name": "🌐 Server 4 (EmbedSU VIP)",
        "url": "https://embed.su/embed/movie/533535",
        "type": "embed"
      },
      {
        "name": "📼 Server 5 (Direct Mirror)",
        "url": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
        "type": "video"
      }
    ],
    "releaseYear": 2024,
    "duration": "128 min",
    "rating": 8.8,
    "ageRating": "18+",
    "quality": "4K Ultra HD",
    "genre": "Action",
    "genres": [
      "Action",
      "Comedy",
      "Sci-Fi"
    ],
    "director": "Shawn Levy",
    "cast": [
      "Ryan Reynolds",
      "Hugh Jackman",
      "Emma Corrin"
    ],
    "isFeatured": true,
    "isTrending": true,
    "isPublished": true,
    "views": 312000,
    "tags": [
      "deadpool",
      "wolverine",
      "marvel",
      "action",
      "hollywood",
      "dual audio"
    ]
  },
  {
    "_id": "67d4f0020000000000000005",
    "title": "Jawan",
    "slug": "jawan",
    "description": "A high-octane emotional thriller about a man set to rectify the wrongs in society with a team of courageous women.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/jawan_poster.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/jawan_backdrop.jpg",
    "trailerUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "videoUrl": "https://vidsrc.to/embed/movie/872585",
    "streamingMirrors": [
      {
        "name": "⚡ Server 1 (VidSrc Pro 4K)",
        "url": "https://vidsrc.to/embed/movie/872585",
        "type": "embed"
      },
      {
        "name": "🎬 Server 2 (VidSrc XYZ)",
        "url": "https://vidsrc.xyz/embed/movie?tmdb=872585",
        "type": "embed"
      },
      {
        "name": "🚀 Server 3 (MultiEmbed Fast)",
        "url": "https://multiembed.mov/?video_id=872585&tmdb=1",
        "type": "embed"
      },
      {
        "name": "🌐 Server 4 (EmbedSU VIP)",
        "url": "https://embed.su/embed/movie/872585",
        "type": "embed"
      },
      {
        "name": "📼 Server 5 (Direct Mirror)",
        "url": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
        "type": "video"
      }
    ],
    "releaseYear": 2023,
    "duration": "169 min",
    "rating": 8.7,
    "ageRating": "16+",
    "quality": "4K Ultra HD",
    "genre": "Action",
    "genres": [
      "Action",
      "Thriller"
    ],
    "director": "Atlee",
    "cast": [
      "Shah Rukh Khan",
      "Nayanthara",
      "Vijay Sethupathi",
      "Deepika Padukone"
    ],
    "isFeatured": false,
    "isTrending": true,
    "isPublished": true,
    "views": 450000,
    "tags": [
      "jawan",
      "srk",
      "shah rukh khan",
      "atlee",
      "action",
      "hindi"
    ]
  },
  {
    "_id": "67d4f0020000000000000006",
    "title": "Animal",
    "slug": "animal",
    "description": "The turbulent relationship between a son and his emotionally unavailable father spirals into extreme bloodshed and revenge.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/animal_poster.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/animal_backdrop.jpg",
    "trailerUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "videoUrl": "https://vidsrc.to/embed/movie/781732",
    "streamingMirrors": [
      {
        "name": "⚡ Server 1 (VidSrc Pro 4K)",
        "url": "https://vidsrc.to/embed/movie/781732",
        "type": "embed"
      },
      {
        "name": "🎬 Server 2 (VidSrc XYZ)",
        "url": "https://vidsrc.xyz/embed/movie?tmdb=781732",
        "type": "embed"
      },
      {
        "name": "🚀 Server 3 (MultiEmbed Fast)",
        "url": "https://multiembed.mov/?video_id=781732&tmdb=1",
        "type": "embed"
      },
      {
        "name": "🌐 Server 4 (EmbedSU VIP)",
        "url": "https://embed.su/embed/movie/781732",
        "type": "embed"
      },
      {
        "name": "📼 Server 5 (Direct Mirror)",
        "url": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
        "type": "video"
      }
    ],
    "releaseYear": 2023,
    "duration": "201 min",
    "rating": 8.6,
    "ageRating": "18+",
    "quality": "4K Ultra HD",
    "genre": "Action",
    "genres": [
      "Action",
      "Crime",
      "Drama"
    ],
    "director": "Sandeep Reddy Vanga",
    "cast": [
      "Ranbir Kapoor",
      "Rashmika Mandanna",
      "Anil Kapoor",
      "Bobby Deol"
    ],
    "isFeatured": false,
    "isTrending": true,
    "isPublished": true,
    "views": 390000,
    "tags": [
      "animal",
      "ranbir kapoor",
      "bobby deol",
      "action",
      "hindi"
    ]
  },
  {
    "_id": "67d4f0020000000000000007",
    "title": "Mirzapur (All Seasons)",
    "slug": "mirzapur",
    "description": "The iron-fisted Akhandanand Tripathi rules Mirzapur. A bloody battle of ambition, revenge, and power unfolds in the heart of Purvanchal.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/mirzapur_poster.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/mirzapur_backdrop.jpg",
    "trailerUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "videoUrl": "https://vidsrc.to/embed/tv/83867/1/1",
    "streamingMirrors": [
      {
        "name": "⚡ Server 1 (VidSrc TV)",
        "url": "https://vidsrc.to/embed/tv/83867/1/1",
        "type": "embed"
      },
      {
        "name": "🎬 Server 2 (VidSrc XYZ)",
        "url": "https://vidsrc.xyz/embed/tv?tmdb=83867&season=1&episode=1",
        "type": "embed"
      },
      {
        "name": "🚀 Server 3 (MultiEmbed Fast)",
        "url": "https://multiembed.mov/?video_id=83867&tmdb=1&s=1&e=1",
        "type": "embed"
      },
      {
        "name": "🌐 Server 4 (EmbedSU VIP)",
        "url": "https://embed.su/embed/tv/83867/1/1",
        "type": "embed"
      },
      {
        "name": "📼 Server 5 (Direct Mirror)",
        "url": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
        "type": "video"
      }
    ],
    "releaseYear": 2024,
    "duration": "3 Seasons (Full HD)",
    "rating": 9.3,
    "ageRating": "18+",
    "quality": "4K Ultra HD",
    "genre": "Drama",
    "genres": [
      "Crime",
      "Drama",
      "Action"
    ],
    "director": "Gurmmeet Singh",
    "cast": [
      "Pankaj Tripathi",
      "Ali Fazal",
      "Shweta Tripathi",
      "Rasika Dugal"
    ],
    "isFeatured": false,
    "isTrending": true,
    "isPublished": true,
    "views": 520000,
    "tags": [
      "mirzapur",
      "kaleen bhaiya",
      "guddu",
      "pankaj tripathi",
      "web series",
      "hindi"
    ]
  },
  {
    "_id": "67d4f0020000000000000008",
    "title": "Stranger Things",
    "slug": "stranger-things",
    "description": "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    "posterUrl": "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    "trailerUrl": "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    "videoUrl": "https://vidsrc.to/embed/tv/66732/1/1",
    "streamingMirrors": [
      {
        "name": "⚡ Server 1 (VidSrc TV)",
        "url": "https://vidsrc.to/embed/tv/66732/1/1",
        "type": "embed"
      },
      {
        "name": "🎬 Server 2 (VidSrc XYZ)",
        "url": "https://vidsrc.xyz/embed/tv?tmdb=66732&season=1&episode=1",
        "type": "embed"
      },
      {
        "name": "🚀 Server 3 (MultiEmbed Fast)",
        "url": "https://multiembed.mov/?video_id=66732&tmdb=1&s=1&e=1",
        "type": "embed"
      },
      {
        "name": "🌐 Server 4 (EmbedSU VIP)",
        "url": "https://embed.su/embed/tv/66732/1/1",
        "type": "embed"
      },
      {
        "name": "📼 Server 5 (Direct Mirror)",
        "url": "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
        "type": "video"
      }
    ],
    "releaseYear": 2024,
    "duration": "4 Seasons (All Episodes)",
    "rating": 9.2,
    "ageRating": "16+",
    "quality": "4K Ultra HD",
    "genre": "Sci-Fi",
    "genres": [
      "Sci-Fi",
      "Horror",
      "Drama",
      "Mystery"
    ],
    "director": "The Duffer Brothers",
    "cast": [
      "Millie Bobby Brown",
      "Finn Wolfhard",
      "Winona Ryder"
    ],
    "isFeatured": false,
    "isTrending": true,
    "isPublished": true,
    "views": 640000,
    "tags": [
      "stranger things",
      "netflix",
      "eleven",
      "sci fi",
      "hindi dub",
      "english"
    ]
  }
];

export const initialReviews = [
  {
    _id: '67d4f0030000000000000001',
    movie: '67d4f0020000000000000001',
    userName: 'Rahul Verma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    rating: 10,
    comment: 'Allu Arjun mass performance! Best action movie of the year. 4K stream is super smooth.',
    createdAt: new Date().toISOString(),
  }
];

export const inMemoryStore = {
  genres: [...initialGenres],
  movies: [...initialMovies],
  reviews: [...initialReviews],
  users: [
    {
      _id: '67d4f0040000000000000001',
      name: 'Super Admin',
      email: 'admin@filmvora.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
    }
  ],
  settings: {
    siteName: 'FILMVORA',
    siteTagline: 'Watch 4K Cinema & Web Series Free',
    enableRegistrations: true,
    enableReviews: true,
    enableAdGate: true,
    directAdUrl: 'https://publishers.monetag.com',
    monetizationAdLink: 'https://publishers.monetag.com',
    adCountdownSeconds: 5,
    telegramBotToken: '',
    telegramBotUsername: 'filmvora_bot',
    telegramChannelId: '@filmvora_official',
  }
};
