#!/usr/bin/env node
const fs = require('fs');
const timers = require('node:timers');
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


/**
 * Membaca file notes.json dan menambahkan catatan ke dalamnya.
 * Jika file notes.json tidak ada, maka akan dibuatkan.
 * Jika file notes.json ada maka akan di parse dan di tambahkan notes
 * Jika terjadi error maka akan di tampilkan ke layar.
 */
function saveNote(notes) {
	// cek apakah file sudah 

	fs.readFile(filePath, 'utf8', (err, notes) => {
		// cek apakah terjadi error
		if (err && err.code !== 'ENOENT') {
			console.error('Gagal Membaca File', err);
			return;
		}
		let data = [];
		if (!err && notes) {
			// parsing
			try {
				data = JSON.parse(notes);
			} catch (parseErr) {
				console.error('Gagal memparsing file json: ', parseErr);
				return;
			}	
		}
		data.push(notes);
		let jsonStrings;
		try {
			jsonStrings = JSON.stringify(data,null,2);
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
