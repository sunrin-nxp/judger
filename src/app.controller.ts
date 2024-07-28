import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { runInSandbox } from './utils/sandbox.util';
import { TestCase } from './interface/in.interface';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	async getHello() {
		const testCases: TestCase[] = [
			{
				input: '1\n2\n',
				expectedOutput: '3',
			},
			{
				input: '5\n10\n',
				expectedOutput: '15',
			},
		];

		const userCode = {
			c: `
        #include <stdio.h>
        int main() {
            int a, b;
            scanf("%d %d", &a, &b);
            printf("%d", a + b);
            return 0;
        }
      `,
			cpp: `
        #include <iostream>
        using namespace std;
        int main() {
            int a, b;
            cin >> a >> b;
            cout << a + b;
            return 0;
        }
      `,
			py: `
        a = int(input())
        b = int(input())
        print(a + b)
      `,
			js: `
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        let input = [];
        rl.on('line', (line) => {
            input.push(line);
            if (input.length === 2) {
                const a = parseInt(input[0]);
                const b = parseInt(input[1]);
                console.log(a + b);
                rl.close();
            }
        });
      `,
			rs: `
        use std::io::{self, Read};
    
        fn main() {
            let mut input = String::new();
            io::stdin().read_to_string(&mut input).unwrap();
            let mut iter = input.split_whitespace();
            let a: i32 = iter.next().unwrap().parse().unwrap();
            let b: i32 = iter.next().unwrap().parse().unwrap();
            println!("{}", a + b);
        }
      `,
			java: `
        import java.util.Scanner;
    
        public class Solution {
            public static void main(String[] args) {
                Scanner scanner = new Scanner(System.in);
                int a = scanner.nextInt();
                int b = scanner.nextInt();
                System.out.println(a + b);
            }
        }
      `,
			kt: `
        fun main() {
            val a = readLine()!!.toInt()
            val b = readLine()!!.toInt()
            println(a + b)
        }
      `,
			go: `
        package main
    
        import "fmt"
    
        func main() {
            var a, b int
            fmt.Scanf("%d\n%d", &a, &b)
            fmt.Println(a + b)
        }
      `
		};
		let resarr = [];
		for (const language of Object.keys(userCode)) {
			console.log(`Testing ${language} code:`);
			for (const testCase of testCases) {
				const result = await runInSandbox(userCode[language], testCase, language);
				console.log(`Test case: ${JSON.stringify(testCase)}`);
				console.log(`Result: ${JSON.stringify(result)}`);
				if (!result.success) {
					resarr.push({
						"lang": language,
						"result": "Error"
					});
					console.log(language, "언어에 런타임 에러 발생");
				}
			}
			resarr.push({
				"lang": language,
				"result": "Success"
			});
			console.log("정답입니다");
		}
		return resarr;
		// return this.appService.getHello();
	}
}
