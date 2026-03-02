-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2026 at 08:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `firepump_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `fire_pump_logs`
--

CREATE TABLE `fire_pump_logs` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `status_run` tinyint(1) DEFAULT NULL,
  `status_fault` tinyint(1) DEFAULT NULL,
  `oil_pressure` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fire_pump_logs`
--

INSERT INTO `fire_pump_logs` (`id`, `station_id`, `status_run`, `status_fault`, `oil_pressure`, `timestamp`) VALUES
(1, 1, 0, 0, 0, '2026-02-25 06:56:59'),
(2, 2, 0, 0, 0, '2026-02-25 06:56:59'),
(3, 7, 0, 0, 0, '2026-02-25 06:56:59'),
(4, 8, 0, 0, 0, '2026-02-25 06:56:59'),
(5, 3, 0, 0, 0, '2026-02-25 06:56:59'),
(6, 5, 0, 0, 0, '2026-02-25 06:56:59'),
(7, 6, 0, 0, 0, '2026-02-25 06:56:59'),
(8, 4, 0, 0, 0, '2026-02-25 06:56:59'),
(9, 2, 1, 0, 0, '2026-02-25 06:57:44'),
(10, 2, 0, 0, 0, '2026-02-25 06:57:46'),
(11, 2, 1, 0, 0, '2026-02-25 06:59:50'),
(12, 2, 0, 0, 0, '2026-02-25 06:59:52'),
(13, 2, 0, 1, 0, '2026-02-25 06:59:57'),
(14, 2, 0, 0, 0, '2026-02-25 06:59:58'),
(15, 2, 0, 1, 0, '2026-02-25 07:00:00'),
(16, 2, 0, 0, 0, '2026-02-25 07:00:01'),
(17, 2, 1, 0, 0, '2026-02-25 07:01:19'),
(18, 2, 0, 0, 0, '2026-02-25 07:01:24'),
(19, 2, 1, 0, 0, '2026-02-25 07:01:36'),
(20, 2, 0, 0, 0, '2026-02-25 07:01:42'),
(21, 2, 1, 0, 0, '2026-02-25 07:01:43'),
(22, 2, 0, 0, 0, '2026-02-25 07:01:45'),
(23, 2, 0, 1, 0, '2026-02-25 07:01:46'),
(24, 2, 0, 0, 0, '2026-02-25 07:01:49'),
(25, 2, 0, 1, 0, '2026-02-25 07:01:59'),
(26, 2, 0, 0, 0, '2026-02-25 07:02:03'),
(27, 2, 1, 0, 0, '2026-02-25 07:02:05'),
(28, 2, 0, 0, 0, '2026-02-25 07:02:16'),
(29, 2, 1, 0, 0, '2026-02-25 07:02:39'),
(30, 2, 0, 0, 0, '2026-02-25 07:02:41'),
(31, 2, 0, 1, 0, '2026-02-25 07:03:02'),
(32, 2, 0, 0, 0, '2026-02-25 07:03:04'),
(33, 2, 1, 0, 0, '2026-02-25 07:04:12'),
(34, 2, 0, 0, 0, '2026-02-25 07:04:36'),
(35, 2, 1, 0, 0, '2026-02-25 07:04:37'),
(36, 2, 0, 0, 0, '2026-02-25 07:04:50'),
(37, 2, 1, 0, 0, '2026-02-25 07:04:51'),
(38, 2, 0, 0, 0, '2026-02-25 07:04:52'),
(39, 2, 1, 0, 0, '2026-02-25 07:15:40'),
(40, 2, 0, 0, 0, '2026-02-25 07:19:44'),
(41, 2, 0, 1, 0, '2026-02-25 07:19:47'),
(42, 1, 0, 0, 0, '2026-02-25 07:19:57'),
(43, 2, 0, 1, 0, '2026-02-25 07:19:57'),
(44, 3, 0, 0, 0, '2026-02-25 07:19:57'),
(45, 4, 0, 0, 0, '2026-02-25 07:19:57'),
(46, 5, 0, 0, 0, '2026-02-25 07:19:57'),
(47, 6, 0, 0, 0, '2026-02-25 07:19:57'),
(48, 7, 0, 0, 0, '2026-02-25 07:19:57'),
(49, 8, 0, 0, 0, '2026-02-25 07:19:57'),
(50, 2, 0, 0, 0, '2026-02-25 07:20:22'),
(51, 2, 0, 1, 0, '2026-02-25 07:20:34'),
(52, 1, 0, 0, 0, '2026-02-25 07:20:49'),
(53, 2, 0, 1, 0, '2026-02-25 07:20:49'),
(54, 3, 0, 0, 0, '2026-02-25 07:20:49'),
(55, 4, 0, 0, 0, '2026-02-25 07:20:49'),
(56, 5, 0, 0, 0, '2026-02-25 07:20:49'),
(57, 6, 0, 0, 0, '2026-02-25 07:20:49'),
(58, 7, 0, 0, 0, '2026-02-25 07:20:49'),
(59, 8, 0, 0, 0, '2026-02-25 07:20:49'),
(60, 2, 0, 0, 0, '2026-02-25 07:21:07'),
(61, 2, 1, 0, 0, '2026-02-25 07:21:30'),
(62, 2, 0, 0, 0, '2026-02-25 07:21:36'),
(63, 2, 1, 0, 0, '2026-02-25 07:21:38'),
(64, 2, 0, 0, 0, '2026-02-25 07:21:40'),
(65, 2, 1, 0, 0, '2026-02-25 07:21:47'),
(66, 2, 0, 0, 0, '2026-02-25 07:21:50'),
(67, 2, 0, 1, 0, '2026-02-25 07:21:51'),
(68, 2, 0, 0, 0, '2026-02-25 07:21:53'),
(69, 2, 0, 1, 0, '2026-02-25 07:24:16'),
(70, 2, 0, 0, 0, '2026-02-25 07:24:17'),
(71, 2, 0, 1, 0, '2026-02-25 07:27:22'),
(72, 2, 0, 0, 0, '2026-02-25 07:27:24'),
(73, 2, 0, 1, 0, '2026-02-25 07:38:25'),
(74, 2, 0, 0, 0, '2026-02-25 07:38:31'),
(75, 2, 0, 1, 0, '2026-02-25 07:38:55'),
(76, 2, 0, 0, 0, '2026-02-25 07:38:57'),
(77, 2, 1, 0, 0, '2026-02-25 07:40:33'),
(78, 2, 0, 0, 0, '2026-02-25 07:40:36'),
(79, 2, 1, 0, 0, '2026-02-25 07:40:52'),
(80, 2, 0, 0, 0, '2026-02-25 07:40:53'),
(81, 2, 1, 0, 0, '2026-02-25 07:40:56'),
(82, 2, 0, 0, 0, '2026-02-25 07:40:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', '$2b$10$nQ1FG6sUPM9TLbhqWcehHuohfko4MDzCN0VJeoNopcc41z7eiBkn2', 'admin', '2026-02-24 07:10:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fire_pump_logs`
--
ALTER TABLE `fire_pump_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `fire_pump_logs`
--
ALTER TABLE `fire_pump_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
