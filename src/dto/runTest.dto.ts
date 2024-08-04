import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";

export class runTestDto {
    @ApiProperty({
        description: "채점할 문제의 ID입니다.",
        example: "10000"
    })
    problemNumber!: Number;

    @ApiProperty({
        description: "제출한 코드의 언어입니다.",
        example: "py"
    })
    language!: String;

    @ApiProperty({
        description: "유저가 제출한 코드입니다.",
        example: `a=int(input());b=int(input());print("그래봤자 모솔")`
    })
    usercode!: String;
}