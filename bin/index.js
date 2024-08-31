#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { timeStamp } = require('console');
const { program } = require('commander');

const filePath = path.join(__dirname, "notes.json");

// input readline
const input = readline.createInterface({
	input : process.stdin,
	output : process.stdout
});

program
	.version('1.0.0')
	.command('task')
	.description('Add a task')

program
	.option('-a, --add <options>', 'add a task',(options) => {
		let opsi = JSON.stringify(options);
		// cek isi file
		if (fs.existsSync(filePath)) {
			let data = [];
			fs.readFile(filePath, 'utf-8',(err, previousData) => {
				if (!err && previousData) {
					// data = JSON.parse(previousData);
					data.push(previousData);
					console.log(data);
					try {
						data = JSON.parse(previousData);
					} catch (error) {
						console.log(error);
						return;
					}
				}
			})

		} else {
			fs.writeFileSync(filePath, '[]');
		}

		data = fs.readFileSync(filePath, 'utf8');

		console.log(data);
		let notes = JSON.parse(opsi);
		fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
		console.log(`New task added :  ${(options)} !`);
	})
	.option('-d, --done', 'done a task')
	.option('-l, --list', 'list all tasks', () => {
		let data = fs.readFileSync(filePath, 'utf8');
		let notes = JSON.parse(data);
		console.log(notes);
	})
	.option('-u, --update', 'update a task');

program.parse(process.argv);
input.close();