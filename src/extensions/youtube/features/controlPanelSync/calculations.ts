export function formatElapsedTime(time: number): string {
	const elapsedSeconds = Math.max(0, Math.floor(Number.isFinite(time) ? time : 0));
	const seconds = elapsedSeconds % 60;
	const totalMinutes = Math.floor(elapsedSeconds / 60);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	const minuteText = hours > 0 ? minutes.toString().padStart(2, "0") : totalMinutes.toString();
	const timeText = `${minuteText}:${seconds.toString().padStart(2, "0")}`;
	return hours > 0 ? `${hours}:${timeText}` : timeText;
}

export type ChapterSegment = { start: number; width: number };
export type BufferedRange = { start: number; end: number };

type ChapterProgressInput = {
	currentTime: number;
	duration: number;
	trackWidth: number;
	chapters: ChapterSegment[];
	bufferedRanges: BufferedRange[];
};

function clamp(value: number): number {
	return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function calculateProgressRatio(currentTime: number, duration: number): number {
	return Number.isFinite(duration) && duration > 0 ? clamp(currentTime / duration) : 0;
}

function scalesAtPosition(position: number, chapters: ChapterSegment[]): number[] {
	return chapters.map(({ start, width }) => clamp((position - start) / width));
}

export function calculateChapterProgress({
	currentTime,
	duration,
	trackWidth,
	chapters,
	bufferedRanges,
}: ChapterProgressInput): { played: number[]; buffered: number[] } {
	const validDuration = Number.isFinite(duration) && duration > 0;
	const playedPosition = calculateProgressRatio(currentTime, duration) * trackWidth;
	const currentBuffer = bufferedRanges.find((range) => currentTime >= range.start && currentTime <= range.end);
	const bufferedPosition = validDuration && currentBuffer ? clamp(currentBuffer.end / duration) * trackWidth : 0;

	return {
		played: scalesAtPosition(playedPosition, chapters),
		buffered: scalesAtPosition(bufferedPosition, chapters),
	};
}
