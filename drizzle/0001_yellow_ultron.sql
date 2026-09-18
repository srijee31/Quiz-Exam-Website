CREATE TABLE `attempt_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attemptId` int NOT NULL,
	`questionId` int NOT NULL,
	`questionIndex` int NOT NULL,
	`selectedOption` varchar(1),
	`correctOption` varchar(1) NOT NULL,
	`isCorrect` int NOT NULL DEFAULT 0,
	`isFlagged` int NOT NULL DEFAULT 0,
	CONSTRAINT `attempt_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question_sets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(240) NOT NULL,
	`fileName` varchar(255),
	`fileUrl` text,
	`fileKey` text,
	`sourceType` enum('pdf','paste','sample') NOT NULL DEFAULT 'sample',
	`extractionStatus` enum('ready','review','failed') NOT NULL DEFAULT 'ready',
	`questionCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `question_sets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`setId` int NOT NULL,
	`subject` varchar(80) NOT NULL,
	`prompt` text NOT NULL,
	`optionA` text NOT NULL,
	`optionB` text NOT NULL,
	`optionC` text NOT NULL,
	`optionD` text NOT NULL,
	`correctOption` enum('A','B','C','D') NOT NULL,
	`explanation` text NOT NULL,
	`sourcePage` int,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`candidateName` varchar(160) NOT NULL,
	`candidateEmail` varchar(320) NOT NULL,
	`quizSize` int NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`accuracy` int NOT NULL DEFAULT 0,
	`timeTakenSeconds` int NOT NULL DEFAULT 0,
	`status` enum('in_progress','submitted','timed_out') NOT NULL DEFAULT 'in_progress',
	`questionSnapshot` text NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`submittedAt` timestamp,
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
