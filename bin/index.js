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
	.option('-d, --done', 'List all tasks that are done')
	.option('-p, --progress', 'List all tasks that are in progress')
	.option('-n, --notdone', 'List all tasks that are not done')
	.option('-a, --all', 'List all tasks')
	// .conflicts('done', 'progress')
	// .conflicts('done', 'notdone')
	// .conflicts('done', 'all')
	.action((options) => {
		let data = fs.readFileSync(filePath, 'utf8');
		let notes = JSON.parse(data);
		if (!data) {
			return console.log("data kosong, tidak ada task ");
		}
		if (options.all){
			console.log('Tasks : ');
			console.log(notes);
		}
		if (options.done){
			notes = notes.filter((task) => task.completed === true);
			console.log(notes);
		}
		if (options.progress)
		{
			notes = notes.filter((task) => task.completed === false);
			console.log(notes);
		}
		if (options.notdone)
		{
			notes = notes.filter((task) => task.completed === false);
			console.log(notes);
		}
		input.close();
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
	.description('Update status a task')
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
				input.question(`What status do you want to update ? `, (answer) => {
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

program
	.command('mark <id> <markOption>')
	.description('Mark a task as in progress or done')
	.action((id, markOption) => {
		let mark = JSON.parse(markOption);
		let data = fs.readFileSync(filePath, 'utf8');
		if (!data) {
			return console.log("data kosong, tidak ada task ");
		} else{
			let notes = JSON.parse(data);
			const idArray = notes.find(item => item.id === id);
			if (idArray) {
				if (markOption === 'true' || markOption === 'false')
				{
					idArray.completed = mark;
					idArray.updatedAt = new Date().toISOString();
				}
				fs.writeFileSync(filePath,JSON.stringify(notes, null , 2));
				console.log(notes);
				// console.log(`Task ${(idArray.taskDesc)} mark as :  ${(idArray.markOption)} !`);
			}
		};
		input.close();
	});


program.parse(process.argv);
