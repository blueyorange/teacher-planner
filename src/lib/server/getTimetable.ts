// app.ts
import * as yaml from 'js-yaml';
import { readFile } from 'fs/promises';
import type { Timetable, Holiday, LessonTime } from '../../models/typedefs'; // Import interfaces

// Load and parse YAML

export async function getTimetable(): Promise<Timetable> {
	const yamlString = await readFile('./timetable.yaml', 'utf8');
	const timetableData = yaml.load(yamlString) as Timetable;

	// Parse terms and holidays, keeping them in UTC
	const holidays = timetableData.holidays.map((h: Holiday) => ({
		name: h.name,
		start: new Date(h.start), // 'Z' ensures it's treated as UTC
		end: new Date(h.end) // 'Z' ensures it's treated as UTC
	}));

	// Parse lesson time data
	const lessonTimes: LessonTime[] = timetableData.lessonTimes;

	return {
		start: new Date(timetableData.start),
		end: new Date(timetableData.end),
		holidays,
		lessonTimes
	};
}
