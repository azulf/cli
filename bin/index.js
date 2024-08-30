#!/usr/bin/env node
const fs = require('fs');
const timers = require('node:timers');
const readline = require('readline');
const path = require('path');
const { timeStamp } = require('console');

const filePath = path.join(__dirname, "notes.json");

// input readline
const input = readline.createInterface({
	input : process.stdin,
	output : process.stdout
});

function saveNote(notes) {
	// cek apakah file sudah ada
	fs.readFile(filePath, 'utf-8', (err, notes) => {
		if (err && err.code !== 'ENOENT'){
			console.error('Gagal Membaca File', err);
			return;
		}

		let data = [];
		if (!err && notes) {
			// parse data jika file sudah ada dan memiliki isi
			try {
				data = JSON.parse(notes);
			} catch (parseErr) {
				console.error('gagal memparsing file json: ', parseErr);
				return;
			}	
		}
		data.push(notes);
		let jsonStrings;
		try {
			jsonStrings = JSON.stringify(data,notes,2);
		}	catch(stringifyErr) {
				console.error('Error mengonversi catatan ke JSON : ', stringifyErr);
				return;
			}

	//tambahkan catatan pada notes 
		fs.writeFile(filePath, jsonStrings, (err) => {
				if (err) {
					console.log("Gagal Menyimpan Catatan", err);
				} 	else {
					console.log('Catatan berhasil disimpan');
				}
				input.close();
	});
});
}

const args = process.argv.slice(2);

if (args.length > 0) {
	const command = args[0];

	const noteText = args.slice(1).join('');
	if (command === 'add')
		if (noteText) {

			saveNote({
				text : noteText,
				timestamp : new Date().toISOString()
			});
		} else {
			console.log('Harap masukkan catatan setelah perintah add');
		}
	else {
		console.log("harus menambahkan add");
	}
} else {
	console.log("minimal banget pake 'add'");
}
