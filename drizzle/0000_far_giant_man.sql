CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`capacity` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`student_id` text NOT NULL,
	`course_id` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`age` integer NOT NULL
);
