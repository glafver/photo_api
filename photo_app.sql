-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Mar 09, 2022 at 10:39 PM
-- Server version: 8.0.19-0ubuntu5
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `photo_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `id` int NOT NULL,
  `title` varchar(250) NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`id`, `title`, `user_id`) VALUES
(1, 'Me and my friends', 1),
(2, 'Summer 2021', 1),
(3, 'The best party', 2),
(4, 'Lovely puppies', 2);

-- --------------------------------------------------------

--
-- Table structure for table `albums_photos`
--

CREATE TABLE `albums_photos` (
  `album_id` int NOT NULL,
  `photo_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `albums_photos`
--

INSERT INTO `albums_photos` (`album_id`, `photo_id`) VALUES
(1, 1),
(1, 2),
(1, 5),
(2, 2),
(2, 5),
(2, 6),
(3, 3),
(3, 4),
(3, 7),
(4, 4),
(4, 7),
(4, 8);

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int NOT NULL,
  `title` varchar(250) NOT NULL,
  `url` varchar(250) NOT NULL,
  `comment` varchar(250) DEFAULT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `title`, `url`, `comment`, `user_id`) VALUES
(1, 'My love', 'https://pbs.twimg.com/media/D-yIlETXoAAYhQk.jpg', 'A very beautiful woman', 1),
(2, 'Bubbles', 'https://i.pinimg.com/originals/a4/77/b4/a477b4a9fd57c2de2cabdcde7f9d6072.jpg', 'Champagne?...', 1),
(3, 'Millennium Falcon', 'https://starwars.su/transport/millennium-falcon/3.jpg', 'My best friend', 2),
(4, 'Sneakers', 'https://blog.nextcamp.ru/uploads/posts/2020-02/1582230882_1566595140_back-to-the-future-nikes2.jpg', 'Back to future!', 2),
(5, 'Test photo - 1', 'https://www.1zoom.ru/big2/632/322509-alexfas01.jpg', 'test', 1),
(6, 'Test photo - 2', 'https://www.1zoom.ru/big2/632/322509-alexfas01.jpg', 'test', 1),
(7, 'Test photo - 3', 'https://www.1zoom.ru/big2/632/322509-alexfas01.jpg', 'test', 2),
(8, 'Test photo - 4', 'https://www.1zoom.ru/big2/632/322509-alexfas01.jpg', 'test', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(250) NOT NULL,
  `first_name` varchar(250) NOT NULL,
  `last_name` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`) VALUES
(1, 'user1@example.com', '$2b$10$YlIynx3/lSCYVJP3wDLou.f7gehuNtRujT7rPAiHNaZC89zWl8Hfm', 'Roger', 'Rabbit'),
(2, 'user2@example.com', '$2b$10$NTdymS23XXFJvCZAgMcvIeR8w8b0z3vZ8zSZa5JnJJ7aFWKSz4VGK', 'Han', 'Solo');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `albums_photos`
--
ALTER TABLE `albums_photos`
  ADD KEY `album_id` (`album_id`),
  ADD KEY `user_id` (`photo_id`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `photo_user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photo_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
