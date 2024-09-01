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
		const argv = process.argv.slice(4);
		const arg = argv.join(' ');
		console.log(arg)
		let opsi = JSON.stringify(arg);
		// cek isi file
		if (fs.existsSync(filePath)) {
			let data = [];
			fs.readFile(filePath, 'utf-8',(err, previousData) => {
				if (!err && previousData) {
					// data = JSON.parse(previousData);
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
		if (!data) {
			data = fs.writeFileSync(filePath, `[${opsi}]`);
		} else {
			let prevdata = [];
			prevdata = JSON.parse(data);
			let notes = JSON.parse(opsi);
			prevdata.push(notes);
			notes = prevdata;
			fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
		}
		
		
		console.log(`New task added :  ${(arg)} !`);
	})
	.option('-d, --done', 'done a task')
	.option('-l, --list', 'list all tasks', () => {
		let data = fs.readFileSync(filePath, 'utf8');
		if (!data) {
			return console.log("data kosong, tidak ada task ");
		}
		else{
			let notes = JSON.parse(data);
			console.log(notes);
		}
	
	})
	.option('-u, --update', 'update a task');

program.parse(process.argv);
input.close();