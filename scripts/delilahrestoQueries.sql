-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-05-2020 a las 07:40:31
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilahresto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `id` int(11) NOT NULL,
  `usuarios_id` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `pago` varchar(10) DEFAULT 'Efectivo',
  `precio_total` float UNSIGNED DEFAULT NULL,
  `comentarios` varchar(2083) DEFAULT NULL,
  `estado` tinyint(10) DEFAULT 1,
  `habilitado` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `orden`
--

INSERT INTO `orden` (`id`, `usuarios_id`, `fecha`, `pago`, `precio_total`, `comentarios`, `estado`, `habilitado`) VALUES
(1, 3, '2020-02-13 04:29:54', 'Efectivo', 800, 'Segundo timbre del portero', 5, 1),
(2, 29, '2020-05-25 23:56:42', 'Efectivo', 4180, 'Por favor traer dos sobres de queso rayado no sean ratas', 1, 1),
(3, 29, '2020-05-23 11:46:54', 'Tarjeta', 760, 'Tercer timbre', 5, 1),
(18, 38, '2020-05-26 00:11:51', 'Tarjeta', 2460, '', 6, 1),
(19, 29, '2020-05-26 01:46:38', 'Tarjeta', 4760, 'Extra queso', 5, 1),
(20, 29, '2020-05-26 05:21:37', 'Tarjeta', 1620, 'Cuidado con el perro', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes_platos`
--

CREATE TABLE `ordenes_platos` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `platos_id` int(11) DEFAULT NULL,
  `cantidad` int(10) UNSIGNED DEFAULT NULL,
  `precio` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ordenes_platos`
--

INSERT INTO `ordenes_platos` (`id`, `orden_id`, `platos_id`, `cantidad`, `precio`) VALUES
(1, 1, 3, 2, 800),
(2, 2, 7, 3, 1290),
(3, 2, 1, 2, 740),
(4, 3, 9, 2, 760),
(15, 2, 6, 5, 2150),
(16, 18, 6, 2, 860),
(17, 18, 3, 4, 1600),
(18, 19, 3, 9, 3600),
(19, 19, 1, 2, 740),
(20, 19, 11, 1, 420),
(21, 20, 9, 2, 760),
(22, 20, 7, 2, 860);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platos`
--

CREATE TABLE `platos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` float UNSIGNED NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `img` varchar(2083) DEFAULT NULL,
  `nuevo_plato` tinyint(4) DEFAULT 0,
  `habilitado` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `platos`
--

INSERT INTO `platos` (`id`, `nombre`, `precio`, `descripcion`, `img`, `nuevo_plato`, `habilitado`) VALUES
(1, 'Ravioles', 370, 'Con salsa boloñesa, mixta, o crema con jamón y champiñones.', 'https://italpastdeli.com.ar/wp-content/uploads/2017/09/MG_5680-1280x853-1024x682.jpg', 0, 1),
(2, 'Lasagna della Nonna', 420, 'Con jamón, mozzarella, salsa de tomates y bechamel.', 'https://italpastdeli.com.ar/wp-content/uploads/2017/09/MG_5682-1280x853-1024x682.jpg', 0, 1),
(3, 'Tortelloni', 400, 'Rellenos de ricota, parmesano y nuez moscada, con salsa de tomates y manteca.', 'https://italpastdeli.com.ar/wp-content/uploads/2019/07/tortelloni-1.jpg', 0, 1),
(4, 'Sorrentinos', 420, 'De ricota, mozzarella y jamón, con salsa de crema con jamón y champiñones.', 'https://italpastdeli.com.ar/wp-content/uploads/2019/07/sorrentini-1-1024x683.jpg', 0, 1),
(5, 'Lasagna Cinque Cipolle', 450, 'Con variedad de cebollas salteadas y queso Brie.', 'https://italpastdeli.com.ar/wp-content/uploads/2017/09/MG_5669-1280x853-1024x682.jpg', 0, 1),
(6, 'Gnocchi Ragu', 430, 'De papa, con salsa de tomates y carne.', 'https://italpastdeli.com.ar/wp-content/uploads/2017/09/MG_5703-1280x853-1024x682.jpg', 0, 1),
(7, 'Sorrentini Rustica', 430, 'Sorrentinos verdes de ricota, mozzarella y albahaca, gratinados con Pomodoro Fresco y bechamel.', 'https://italpastdeli.com.ar/wp-content/uploads/2019/07/sorrentini-verdi-rustica-1024x683.jpg', 0, 1),
(8, 'Lasagna Nero Seppia', 500, 'Masa negra, con langostinos, cebolla de verdeo, zapallo cabutia y bechamel.', 'https://italpastdeli.com.ar/wp-content/uploads/2017/09/MG_5676-1280x853-1024x682.jpg', 0, 0),
(9, 'Pasta al Pomodoro', 380, 'Pasta a elección entre Spaghetti, Penne Rigate y Rigatoni, con salsa de tomates frescos y albahaca.', 'https://italpastdeli.com.ar/wp-content/uploads/2019/07/pasta-al-pomodoro-e-basilico-1024x683.jpg', 0, 1),
(10, 'Cappelletti', 420, 'Pasta rellena de lomo, mortadela italiana y jamón crudo, con salsa de tomates frescos.', 'https://italpastdeli.com.ar/wp-content/uploads/2017/06/Italpast_46-1024x682.jpg', 0, 1),
(11, 'Fettuccine al Pesto', 420, 'Cintas de espinaca fresca, con pesto casero.', 'https://italpastdeli.com.ar/wp-content/uploads/2019/04/fettuccine-spinaci-al-pesto-1024x683.jpg', 0, 1),
(12, 'Gnocchi di Lusso', 460, 'De papa con salsa de cebolla, champiñones, queso Mascarpone y aceite de trufa.', 'https://italpastdeli.com.ar/wp-content/uploads/2019/07/Gnocchi-di-Lusso.jpg', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `nombreyapellido` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `admin` tinyint(4) DEFAULT 0,
  `habilitado` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`, `nombreyapellido`, `email`, `telefono`, `direccion`, `admin`, `habilitado`) VALUES
(1, 'Admin1', '123456', 'Admin1', 'admin1@delilaresto.com', '282-167-7201', 'delilaresto 000', 1, 1),
(2, 'Admin2', '123456', 'Admin2', 'admin2@delilaresto.com', '(611) 298-8446 x120', 'delilaresto', 1, 1),
(3, 'Rodger38', 'HB2dQgCWKZdXDsv', 'Angeline Green Sr.', 'Florencio.Nader@gmail.com', '335-856-2353', '1009 Keagan Pines', 0, 1),
(4, 'Brandon96', 'QdNmhEylxMT7rVn', 'Sanford Rohan', 'Madison.Ernser@yahoo.com', '743-435-3004', '3100 Daren Fords', 0, 1),
(5, 'Vinnie.Torphy', 'r6e47ZrMjbVHLVB', 'Lilliana Hessel', 'Ed_Torphy@gmail.com', '181-403-5991', '9116 Alta Lane', 0, 1),
(6, 'Barbara9', '9vPapJZUszRp7Gu', 'Ubaldo Bergstrom V', 'Brisa.Metz@gmail.com', '463.218.7326 x843', '02102 Maryam Summit', 0, 1),
(7, 'Javonte18', 'lgpcY4NHSSYJoV5', 'Mrs. Faye Hoeger', 'Joannie.Bednar@gmail.com', '(317) 143-1239 x0325', '325 Violet Shoals', 0, 1),
(8, 'Thea21', 'EZw6YFR8UNgFCnv', 'Sidney Schuppe', 'Mafalda_Fay75@gmail.com', '1-284-375-7747', '49615 Stamm Lake', 0, 1),
(9, 'Damian_Kohler', 'p72oL0o5BteV4dT', 'Maya Hoppe', 'Orlo21@yahoo.com', '(333) 886-6338 x6728', '2436 Jarrod Curve', 0, 1),
(10, 'Alene_Medhurst90', '8Gbnysj5abdY695', 'Miss Jessika Waelchi', 'Etha60@gmail.com', '1-981-564-4134', '5331 Lockman Trail', 0, 1),
(11, 'Ericka63', 'qBzlhvq9YmRfoRg', 'Delmer Durgan', 'Clementina81@hotmail.com', '075.427.4192 x0183', '41568 Judd Divide', 0, 1),
(12, 'Summer.Schuster33', 'aKYm3GagB_8kS6V', 'Sabina Aufderhar', 'Gerry_Thiel23@hotmail.com', '1-167-461-8981', '46693 Pablo Points', 0, 1),
(13, 'Selena23', 'UkFz_swRYrG98HB', 'Marques Metz', 'Wiley13@gmail.com', '898-847-8641 x76836', '1956 Leonie Ville', 0, 1),
(15, 'Deangelo_Kub', 'bDLqpt0mBOlDPGQ', 'Lizzie Collier Jr.', 'Clotilde_Padberg83@hotmail.com', '531-890-8972', '39088 Ratke Garden', 0, 1),
(16, 'Anissa_Schumm', 'jy0oVQ_cuwBnATq', 'Merlin Parker', 'Emmalee_Leannon38@hotmail.com', '1-052-090-1720', '696 Wayne Estates', 0, 1),
(17, 'Brayan_Nikolaus64', 'TTfKi12rQ1dZQF6', 'Tyrell Hauck', 'Enrico_Hartmann65@gmail.com', '(205) 780-7889 x7764', '80252 Kohler Estate', 0, 1),
(18, 'Ernie17', '2Ce_GekhELyWxom', 'Cheyenne Bahringer', 'Houston_Schmidt39@hotmail.com', '1-476-849-7778 x175', '5223 Heller Landing', 0, 1),
(19, 'Mack.Padberg84', 'wp5EirQqtuvVW8C', 'Chaim Spinka', 'Denis.Doyle@gmail.com', '(001) 995-0582 x680', '79051 Leannon Stravenue', 0, 1),
(20, 'Ruthe.Muller', 'E1O23jQHMqcZs6a', 'Katlyn Harvey', 'Gerry31@hotmail.com', '(957) 468-1842 x378', '3182 Roosevelt Ranch', 0, 1),
(21, 'Bette_Shanahan84', 'bIU5LQIHmw1rs8J', 'Bertrand Douglas', 'Shanon_Schultz@yahoo.com', '(062) 702-0558 x688', '33165 Bergstrom Gardens', 0, 1),
(22, 'Angeline.Monahan34', 'gicoduJB2bLyiCw', 'Mr. Erika Berge', 'Ulices.Sanford@gmail.com', '488-226-8292 x0977', '735 Eugenia Greens', 0, 1),
(23, 'Rogers54', 'OHApEicppHqO_wZ', 'Mose Mertz', 'Burley_Schroeder@hotmail.com', '1-856-515-7703 x555', '9182 Nicolette Springs', 0, 1),
(24, 'Burnice_Grady58', 'JCNFCavHyUQonKz', 'Fredrick Kiehn', 'Beryl.Schaden48@yahoo.com', '023.033.3288', '2318 Sporer Parkways', 0, 1),
(25, 'Karine_Bednar', 'NWwZGnhulBwARIY', 'Modesto Schulist', 'Lucio.Brakus@hotmail.com', '446-988-1069 x024', '401 Toy Tunnel', 0, 1),
(26, 'Camille47', 'vFcAOPtJ4UotTUY', 'Mafalda Lindgren', 'Tiana_Friesen10@gmail.com', '1-403-843-6193', '83622 Quitzon Camp', 0, 1),
(27, 'Rowena.Ankunding', '4alOTyPHgTan9Yr', 'Earlene Bechtelar', 'Noelia_Brown@yahoo.com', '625-572-6387', '94107 Chadd Harbors', 0, 1),
(28, 'Summer_Schimmel', 'KYWu7N5rRO1qU9k', 'Rusty Quitzon', 'Imani.Wilderman68@gmail.com', '(521) 944-0274 x543', '89720 Harber Lake', 0, 1),
(29, 'Gerot', '4j65U4q6MkeKY8F', 'Macomo Iltesti Lapasta', 'Casey_Gerhold41@yahoo.com', '1-298-916-4127', '35047 Dietrich Inlet', 0, 1),
(30, 'Clovis.Wehner30', 'YZYJa3A9DHTY6Gj', 'Rick Stiedemann', 'Stephen.McKenzie26@gmail.com', '550.182.8786 x2697', '0671 Electa Spurs', 0, 1),
(31, 'Taylor66', 'TNlfk5AZpITeMJy', 'Dr. Burley Swaniawski', 'Kenna_Bruen35@yahoo.com', '1-728-674-7554', '9086 Bartoletti Fords', 0, 1),
(32, 'Nyasia70', '_ezv4O94FINhREe', 'Miss Zachary Nader', 'Zita_Smith43@hotmail.com', '126.822.9389', '5594 Kertzmann Trafficway', 0, 1),
(33, 'Oren66', 'oJFHm1Z4onjxjlu', 'Jewel Nienow', 'Calista_Hodkiewicz@gmail.com', '522-669-7976 x96633', '57999 Leone Heights', 0, 1),
(34, 'Santa76', 'dM7vaKHFWw70lsr', 'Kian Strosin MD', 'Taylor80@hotmail.com', '964.941.5276 x323', '418 Braulio Highway', 0, 1),
(35, 'Bobbie.Reynolds12', '05HFF6dmsjEtZay', 'Nels Haley', 'Lexi_Carroll97@gmail.com', '518-380-6953', '51730 Mante Fall', 0, 1),
(36, 'Lloyd.Carter', 'WRMKM6E4lNOZCn1', 'Maude Fisher', 'Jaqueline_Reinger93@hotmail.com', '328.557.5691 x00218', '708 Hirthe Viaduct', 0, 1),
(37, 'Verla49', '08Jv3gXNo5_6tCY', 'Tia Brekke Sr.', 'Eldon26@hotmail.com', '1-044-897-4369', '381 Lindgren Parkways', 0, 1),
(38, 'Tyler19', 'I38wz9z3LFsUuZT', 'Bette Grimes', 'Patience.Feest@yahoo.com', '965-948-9238 x866', '7768 Susie Mews', 0, 1),
(39, 'Flavie_Crona', '0kteRusnpVtA5TU', 'Jerrell Rodriguez', 'Beulah.Haag95@hotmail.com', '560-508-0749', '0774 Marcos Cape', 0, 1),
(40, 'Reina20', '7AYOoF1Td6FaBn8', 'Fern Kling', 'Zackary_Batz76@hotmail.com', '1-018-959-2629 x83916', '09295 Maribel Branch', 0, 1),
(41, 'Terrill_Borer58', 'ngiGMKfh8dRSgws', 'Dr. Khalil Boehm', 'Bernadine.Wisoky@hotmail.com', '(610) 850-1614', '2140 Dena Union', 0, 1),
(42, 'Orval_Hauck26', 'r1tnCugEpIGbZMx', 'Tyshawn Hahn', 'Olen27@yahoo.com', '416.839.6001', '2633 Lora Falls', 0, 1),
(43, 'Vallie_Kertzmann71', 'F9FFRV8mhMtPdqr', 'Mrs. Charley Cruickshank', 'Annette6@yahoo.com', '819.290.6615', '01935 Alex Roads', 0, 1),
(44, 'Sigurd_Maggio', 'MBy8bt7W30PKNkX', 'Pearl White', 'Mafalda_Gleason19@hotmail.com', '(152) 199-3031', '2210 Fabian Hill', 0, 1),
(45, 'Earlene42', 'rsSRbBrkHMjTtD6', 'Emerald Parisian', 'Selena69@hotmail.com', '049.733.2419', '758 Bednar Harbor', 0, 1),
(46, 'Marilyne_Swaniawski', '9sVkoPDQBkF_xmn', 'Jerad Rodriguez III', 'Cleo35@yahoo.com', '262-014-3128 x52536', '596 Eleazar Alley', 0, 1),
(47, 'Sedrick_Cole', '_QkGdPaaztfZ_kv', 'Miss Brennon Macejkovic', 'Arnulfo.Lindgren58@gmail.com', '1-415-519-5129 x5988', '13656 Don Inlet', 0, 1),
(48, 'Joana.Berge', 'EIB_42ZxAy0IjpY', 'Easter Gulgowski', 'Hillard.Hauck@yahoo.com', '852.408.1716 x25421', '73271 Johnathon Terrace', 0, 1),
(49, 'Eriberto.Fritsch8', 'YLAr54tlaVVJlxi', 'Lonny Blick II', 'Mabel_Jones55@hotmail.com', '817.501.3177 x5513', '2642 Cummerata Parkway', 0, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `orden`
--
ALTER TABLE `orden`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Orden_usuarios_idx` (`usuarios_id`);

--
-- Indices de la tabla `ordenes_platos`
--
ALTER TABLE `ordenes_platos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ordenes_platos_Orden1_idx` (`orden_id`),
  ADD KEY `fk_ordenes_platos_platos1_idx` (`platos_id`);

--
-- Indices de la tabla `platos`
--
ALTER TABLE `platos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `ordenes_platos`
--
ALTER TABLE `ordenes_platos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `platos`
--
ALTER TABLE `platos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `orden`
--
ALTER TABLE `orden`
  ADD CONSTRAINT `fk_Orden_usuarios` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `ordenes_platos`
--
ALTER TABLE `ordenes_platos`
  ADD CONSTRAINT `fk_ordenes_platos_Orden1` FOREIGN KEY (`orden_id`) REFERENCES `orden` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_ordenes_platos_platos1` FOREIGN KEY (`platos_id`) REFERENCES `platos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
