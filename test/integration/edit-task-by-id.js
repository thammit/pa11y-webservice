// This file is part of Pa11y Webservice.
//
// Pa11y Webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Pa11y Webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Pa11y Webservice.  If not, see <http://www.gnu.org/licenses/>.
'use strict';

const assert = require('proclaim');

describe('PATCH /tasks/{taskId}}', function() {

	describe('with valid and existing task ID', function() {

		describe('with valid JSON', function() {
			let taskEdits;

			beforeEach(async function() {
				taskEdits = {
					name: 'New Name',
					timeout: '30000',
					wait: 1000,
					username: 'user',
					password: 'access',
					ignore: ['bar', 'baz'],
					headers: {
						foo: 'bar'
					},
					hideElements: 'foo',
					actions: [
						'click element body'
					],
					runners: ['run', 'sprint'],
					comment: 'Just changing some stuff, you know'
				};
				const request = {
					method: 'PATCH',
					endpoint: 'tasks/abc000000000000000000001',
					body: taskEdits
				};
				await this.navigate(request);
			});

			it('should update the task\'s name in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.strictEqual(task.name, taskEdits.name);
			});

			it('should update the task\'s wait time in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.strictEqual(task.wait, taskEdits.wait);
			});

			it('should update the task\'s username in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.strictEqual(task.username, taskEdits.username);
			});

			it('should update the task\'s password in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.strictEqual(task.password, taskEdits.password);
			});

			it('should update the task\'s ignore rules in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.deepEqual(task.ignore, taskEdits.ignore);
			});

			it('should update the task\'s headers in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.deepEqual(task.headers, taskEdits.headers);
			});

			it('should update the task\'s hidden elements in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.deepEqual(task.hideElements, taskEdits.hideElements);
			});

			it('should update the task\'s actions in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.deepEqual(task.actions, taskEdits.actions);
			});

			it('should update the task\'s associated runners in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.deepEqual(task.runners, taskEdits.runners);
			});

			it('should add an annotation for the edit to the task', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.isArray(task.annotations);
				assert.isObject(task.annotations[0]);
				assert.strictEqual(task.annotations[0].comment, taskEdits.comment);
				assert.isNumber(task.annotations[0].date);
				assert.strictEqual(task.annotations[0].type, 'edit');
			});

			it('should send a 200 status', function() {
				assert.strictEqual(this.response.status, 200);
			});

		});

		describe('with headers set as a string', function() {
			let taskEdits;

			beforeEach(async function() {
				taskEdits = {
					name: 'New Name',
					headers: '{"foo":"bar"}'
				};
				const request = {
					method: 'PATCH',
					endpoint: 'tasks/abc000000000000000000001',
					body: taskEdits
				};
				await this.navigate(request);
			});

			it('should update the task\'s headers in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.deepEqual(task.headers, {
					foo: 'bar'
				});
			});

		});

		describe('with invalid name', function() {
			let taskEdits;

			beforeEach(async function() {
				taskEdits = {
					name: null
				};
				const request = {
					method: 'PATCH',
					endpoint: 'tasks/abc000000000000000000001',
					body: taskEdits
				};
				await this.navigate(request);
			});

			it('should send a 400 status', function() {
				assert.strictEqual(this.response.status, 400);
			});

		});

		describe('with URL', function() {
			let taskEdits;

			beforeEach(async function() {
				taskEdits = {
					name: 'New Name',
					url: 'http://example.com/'
				};
				const request = {
					method: 'PATCH',
					endpoint: 'tasks/abc000000000000000000001',
					body: taskEdits
				};
				await this.navigate(request);
			});

			it('should not the task in the database', async function() {
				const task = await this.app.model.task.getById('abc000000000000000000001');
				assert.notStrictEqual(task.name, taskEdits.name);
				assert.notStrictEqual(task.url, taskEdits.url);
			});

			it('should send a 400 status', function() {
				assert.strictEqual(this.response.status, 400);
			});

		});

	});

	describe('with a non-array actions', function() {
		let taskEdits;

		beforeEach(async function() {
			taskEdits = {
				actions: 'wat?'
			};
			const request = {
				method: 'PATCH',
				endpoint: 'tasks/abc000000000000000000001',
				body: taskEdits
			};
			await this.navigate(request);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.response.status, 400);
		});

		it('should not update the task in the database', async function() {
			const task = await this.app.model.task.getById('abc000000000000000000001');
			assert.notDeepEqual(task.actions, taskEdits.actions);
		});

	});

	describe('with a invalid actions', function() {
		let taskEdits;

		beforeEach(async function() {
			taskEdits = {
				actions: [
					'foo',
					'bar'
				]
			};
			const request = {
				method: 'PATCH',
				endpoint: 'tasks/abc000000000000000000001',
				body: taskEdits
			};
			await this.navigate(request);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.response.status, 400);
		});

		it('should not update the task in the database', async function() {
			const task = await this.app.model.task.getById('abc000000000000000000001');
			assert.notDeepEqual(task.actions, taskEdits.actions);
		});

	});

	describe('with invalid runners during edit', function() {
		let taskEdits;

		const defaultRunners = ['htmlcs'];

		beforeEach(function(done) {
			// Runners need to be strings
			taskEdits = {
				runners: [
					1,
					2
				]
			};
			const request = {
				method: 'PATCH',
				endpoint: 'tasks/abc000000000000000000001',
				body: taskEdits
			};
			this.navigate(request, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 400);
		});

		it('should not update the task in the database and continue to be default', async function() {
			const task = await this.app.model.task.getById('abc000000000000000000001');
			assert.notDeepEqual(task.runners, taskEdits.runners);
			assert.deepEqual(task.runners, defaultRunners);
		});
	});

	describe('with valid but non-existent task ID', function() {

		beforeEach(async function() {
			const request = {
				method: 'PATCH',
				endpoint: 'tasks/abc000000000000000000000',
				body: {
					name: 'foo',
					timeout: '30000'
				}
			};
			await this.navigate(request);
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.response.status, 404);
		});

	});

	describe('with invalid task ID', function() {

		beforeEach(async function() {
			const request = {
				method: 'PATCH',
				endpoint: 'tasks/-abc-',
				body: {
					name: 'foo',
					timeout: '30000'
				}
			};
			await this.navigate(request);
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.response.status, 404);
		});

	});

});
