import type { Timetable, Lesson } from '../../models/typedefs';
import { promises as fs } from 'fs';
import { join } from 'path';
const LESSONPLANSDIR = './lessonplans/';

export function generateLessonTimes(timetable: Timetable): Lesson[] {
	const lessons: Lesson[] = [];
	const currentDate = new Date(timetable.start);

	while (currentDate <= timetable.end) {
		const currentDay = currentDate.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, etc.)

		// Check if the current day is a holiday
		const isHoliday = timetable.holidays.some(
			(holiday) => currentDate >= holiday.start && currentDate <= holiday.end
		);

		if (!isHoliday) {
			// Find all lessons for the current day
			timetable.lessonTimes.forEach((lessonTime) => {
				if (lessonTime.day === currentDay) {
					const lessonDate = new Date(currentDate);
					lessons.push({
						lessonTime: lessonTime,
						date: lessonDate,
						content: '',
						group: lessonTime.group
					});
				}
			});
		}

		// Move to the next day
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return lessons;
}

async function readMarkdownFiles(dir: string) {
	try {
		// Read all files in the directory
		const files = await fs.readdir(dir);

		// Filter .md files
		const mdFiles = files.filter((file) => file.endsWith('.md'));

		// Read the contents of each .md file
		const fileContents = await Promise.all(
			mdFiles.map(async (file) => {
				const filePath = join(dir, file);
				const content = await fs.readFile(filePath, 'utf-8');
				return { file, content };
			})
		);

		return fileContents;
	} catch (err) {
		console.error('Error reading markdown files:', err);
	}
}

export async function getLessonContentByGroup() {
	const markdownData = await readMarkdownFiles(LESSONPLANSDIR);

	if (!markdownData) {
		return [];
	}

	const lessonPlans = markdownData.map((x) => ({
		group: x.file.split('.')[0],
		lessons: x.content.split(/\n---\n|\r\n---\r\n/)
	}));

	return lessonPlans;
}
