export interface Timetable {
	start: Date;
	end: Date;
	holidays: Holiday[];
	lessonTimes: LessonTime[];
}

export interface Holiday {
	name: string;
	start: Date;
	end: Date;
}

export interface LessonTime {
	day: number;
	group: string;
	start: string;
	end: string;
}

export interface Lesson {
	lessonTime: LessonTime;
	date: Date;
	content: string;
	group: string;
}
