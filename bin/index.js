#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { timeStamp } = require('console');
const { program } = require('commander');
const { argv } = require('process');
const { parseArgs } = require('util');

const filePath = path.join(__dirname, "notes.json");


// input readline
const input = readline.createInterface({
	input : process.stdin,
	output : process.stdout
});

program
	.version('1.0.0')
	.command('add <idn> <task>')
	.description('Add a task')
	.action((idn,task) => {
		const task_array = {
			id: idn,
			taskDesc : task,
			status: 'todo',
			createdAt: new Date().toISOString(),
			updatedAt: null,
			completed: false
		};
		let data = [] ;
		if (fs.existsSync(filePath)) {
			
			fs.readFile(filePath, 'utf-8',(err, previousData) => {
				if (!err && previousData) {
					try {
						const forwardData = JSON.parse(previousData);
						data = forwardData;	
					} catch (error) {
						console.log(error);
						return;
					}
				}
				else {
					fs.writeFileSync(filePath, '[]');
				}
				data.push(task_array);
				fs.writeFileSync(filePath,JSON.stringify(data, null , 2));
			});
		} else {
			fs.writeFileSync(filePath, '[]');
		} 
		console.log(`New task added :  ${(task_array.taskDesc)} !`);
	});

program
	.command('list')
	.description('List all tasks')
	.action(() => {
		console.log('Tasks : ');
		let data = fs.readFileSync(filePath, 'utf8');
		if (!data) {
			return console.log("data kosong, tidak ada task ");
		}
		else{
			let notes = JSON.parse(data);
			console.log(notes);
		}
	});

program
	.command('done <id>')
	.description('Delete/Done a task')
	.action((id) => {
		let data = fs.readFileSync(filePath, 'utf8');
		if (!data) {
			return console.log("data kosong, tidak ada task ");
		}
		else{
			let notes = JSON.parse(data);
			notes = notes.filter((task) => task.id !== id);
			fs.writeFileSync(filePath,JSON.stringify(notes, null , 2));
			console.log(`Task deleted :  ${(id)} !`);
		}
	});

program
	.command('update <id>')
	.description('Update a task')
	.action((id) => {
		let data = fs.readFileSync(filePath, 'utf8');
		if (!data) {
			return console.log("data kosong, tidak ada task ");
		}
		else{
			let notes = JSON.parse(data);
			const idArray = notes.find(item => item.id === id);
			console.log(idArray);		
			if (idArray) {
				input.question(`What is your task status? `, (answer) => {
					if (answer === 'todo') {
						idArray.status = 'todo';
						idArray.updatedAt = new Date().toISOString();
						idArray.completed = false;
					} else if (answer === 'done') {
						idArray.status = 'done';
						idArray.updatedAt = new Date().toISOString();
						idArray.completed = !idArray.completed;
					} else if (answer === 'in-progress') {
						idArray.status = 'in-progress';
						idArray.updatedAt = new Date().toISOString();
						idArray.completed = false;
					} else {
						console.log("Input Not Valid");
						
					}
					input.close();
					fs.writeFileSync(filePath,JSON.stringify(notes, null , 2));
					console.log(`Task updated :  ${(idArray.status)} !`);
				});
				
			} else {
				console.log(`Task dengan id ${id} tidak ditemukan`);
			}
			
			
		};
	});

program.parse(process.argv);
