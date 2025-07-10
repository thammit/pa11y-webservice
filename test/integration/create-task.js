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
const {ObjectID} = require('mongodb');

describe('POST /tasks', function() {

	describe('with valid JSON', function() {
		let newTask;

		beforeEach(async function() {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				standard: 'WCAG2AA',
				ignore: ['foo', 'bar'],
				runners: ['axe']
			};

			await this.navigate({
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			});
		});

		it('should add the new task to the database', async function() {
			const task = await this.app.model.task.collection.findOne(newTask);
			assert.isDefined(task);
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.response.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			const taskPath = `/tasks/${this.response.body.id}`;
			assert.match(
				this.response.headers?.location,
				new RegExp(`${taskPath}$`)
			);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.response.body.id);
			assert.strictEqual(this.response.body.name, newTask.name);
			assert.strictEqual(this.response.body.url, newTask.url);
			assert.strictEqual(this.response.body.standard, newTask.standard);
			assert.deepEqual(this.response.body.ignore, newTask.ignore || []);
			assert.deepEqual(this.response.body.ignore, newTask.runners);
		});
	});

	describe('with valid JSON and HTTP basic user authentication', function() {
		let newTask;
		const defaultRunners = ['htmlcs'];

		beforeEach(async function() {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				standard: 'WCAG2AA',
				username: 'user',
				password: 'access',
				ignore: ['foo', 'bar'],
				hideElements: 'foo'
			};
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			await this.navigate(request);
		});

		it('should add the new task to the database', async function() {
			const task = await this.app.model.task.collection.findOne(newTask);
			assert.isDefined(task);
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.response.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			const taskPath = `/tasks/${this.response.body.id}`;
			assert.match(
				this.response.headers?.location,
				new RegExp(`${taskPath}$`)
			);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.response.body.id);
			assert.strictEqual(this.response.body.name, newTask.name);
			assert.strictEqual(this.response.body.url, newTask.url);
			assert.strictEqual(this.response.body.username, newTask.username);
			assert.strictEqual(this.response.body.password, newTask.password);
			assert.strictEqual(this.response.body.standard, newTask.standard);
			assert.deepEqual(this.response.body.ignore, newTask.ignore || []);
			assert.deepEqual(this.response.body.ignore, defaultRunners);
			assert.deepEqual(this.response.body.hideElements, newTask.hideElements);
		});

	});

	describe('with valid JSON and no ignore rules', function() {
		let newTask;

		beforeEach(async function() {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				standard: 'WCAG2AA'
			};
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			await this.navigate(request);
		});

		it('should add the new task to the database', async function() {
			const task = await this.app.model.task.collection.findOne(newTask);
			assert.isDefined(task);
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.response.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			const taskPath = `/tasks/${this.response.body.id}`;
			assert.match(
				this.response.headers?.location,
				new RegExp(`${taskPath}$`)
			);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.response.body.id);
			assert.strictEqual(this.response.body.name, newTask.name);
			assert.strictEqual(this.response.body.url, newTask.url);
			assert.strictEqual(this.response.body.standard, newTask.standard);
			assert.deepEqual(this.response.body.ignore, []);
		});

	});

	describe('with valid JSON and wait time', function() {
		let newTask;

		beforeEach(async function() {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				wait: 1000,
				standard: 'WCAG2AA'
			};
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			await this.navigate(request);
		});

		it('should add the new task to the database', async function() {
			const task = await this.app.model.task.collection.findOne(newTask);
			assert.isDefined(task);
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.response.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			const taskPath = `/tasks/${this.response.body.id}`;
			assert.match(
				this.response.headers?.location,
				new RegExp(`${taskPath}$`)
			);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.response.body.id);
			assert.strictEqual(this.response.body.name, newTask.name);
			assert.strictEqual(this.response.body.url, newTask.url);
			assert.strictEqual(this.response.body.standard, newTask.standard);
			assert.deepEqual(this.response.body.wait, newTask.wait);
			assert.deepEqual(this.response.body.ignore, []);
		});

	});

	describe('with valid JSON and hideElements', function() {
		let newTask;

		beforeEach(async function() {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				wait: 1000,
				standard: 'WCAG2AA',
				hideElements: '.text-gray-light,.full-width'
			};
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			await this.navigate(request);
		});

		it('should add the new task to the database', async function() {
			const task = await this.app.model.task.collection.findOne(newTask);
			assert.isDefined(task);
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.response.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			const taskPath = `/tasks/${this.response.body.id}`;
			assert.match(
				this.response.headers?.location,
				new RegExp(`${taskPath}$`)
			);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.response.body.id);
			assert.strictEqual(this.response.body.name, newTask.name);
			assert.strictEqual(this.response.body.url, newTask.url);
			assert.strictEqual(this.response.body.standard, newTask.standard);
			assert.deepEqual(this.response.body.wait, newTask.wait);
			assert.deepEqual(this.response.body.hideElements, newTask.hideElements);
			assert.deepEqual(this.response.body.ignore, []);
		});

	});

	describe('with valid JSON and actions', function() {
		let newTask;

		beforeEach(async function() {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				wait: 1000,
				standard: 'WCAG2AA',
				actions: [
					'click element div',
					'click element body'
				]
			};
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			await this.navigate(request);
		});

		it('should add the new task to the database', async function() {
			const task = await this.app.model.task.collection.findOne(newTask);
			assert.isDefined(task);
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.response.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			const taskPath = `/tasks/${this.response.body.id}`;
			assert.match(
				this.response.headers?.location,
				new RegExp(`${taskPath}$`)
			);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.response.body.id);
			assert.strictEqual(this.response.body.name, newTask.name);
			assert.strictEqual(this.response.body.url, newTask.url);
			assert.strictEqual(this.response.body.standard, newTask.standard);
			assert.deepEqual(this.response.body.wait, newTask.wait);
			assert.deepEqual(this.response.body.actions, newTask.actions);
			assert.deepEqual(this.response.body.ignore, []);
		});

	});

	describe('with valid JSON and headers object', function() {
		let newTask;

		beforeEach(async function() {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				standard: 'WCAG2AA',
				headers: {
					foo: 'bar'
				}
			};
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			await this.navigate(request);
		});

		it('should add the new task to the database', async function() {
			const task = await this.app.model.task.collection.findOne({
				_id: new ObjectID(this.response.body.id)
			});
			assert.isDefined(task);
			assert.deepEqual(task.headers, newTask.headers);
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.response.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			const taskPath = `/tasks/${this.response.body.id}`;
			assert.match(
				this.response.headers?.location,
				new RegExp(`${taskPath}$`)
			);
		});

		it('should output a JSON representation of the new task', function() {
			assert.deepEqual(this.response.body.headers, newTask.headers);
		});

	});

	describe('with valid JSON and headers string', function() {
		let newTask;

		beforeEach(async function() {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				standard: 'WCAG2AA',
				headers: '{"foo":"bar"}'
			};
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			await this.navigate(request);
		});

		it('should add the new task to the database', async function() {
			const task = await this.app.model.task.collection.findOne({
				_id: new ObjectID(this.response.body.id)
			});
			assert.isDefined(task);
			assert.deepEqual(task.headers, {
				foo: 'bar'
			});
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.response.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			const taskPath = `/tasks/${this.response.body.id}`;
			assert.match(
				this.response.headers?.location,
				new RegExp(`${taskPath}$`)
			);
		});

		it('should output a JSON representation of the new task', function() {
			assert.deepEqual(this.response.body.headers, {
				foo: 'bar'
			});
		});

	});

	describe('with invalid name', function() {

		beforeEach(async function() {
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					name: null,
					url: 'nature.com',
					standard: 'WCAG2AA'
				}
			};
			await this.navigate(request);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.response.status, 400);
		});

	});

	describe('with invalid URL', function() {

		beforeEach(async function() {
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					url: null,
					standard: 'WCAG2AA'
				}
			};
			await this.navigate(request);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.response.status, 400);
		});

	});

	describe('with invalid standard', function() {

		beforeEach(async function() {
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					url: 'nature.com',
					standard: 'foo'
				}
			};
			await this.navigate(request);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.response.status, 400);
		});

	});

	describe('with a non-array actions', function() {

		beforeEach(async function() {
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					name: 'NPG Home',
					url: 'nature.com',
					standard: 'WCAG2AA',
					actions: 'wat?'
				}
			};
			await this.navigate(request);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.response.status, 400);
		});

	});

	describe('with invalid actions', function() {

		beforeEach(async function() {
			const request = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					name: 'NPG Home',
					url: 'nature.com',
					standard: 'WCAG2AA',
					actions: [
						'foo',
						'bar'
					]
				}
			};
			await this.navigate(request);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.response.status, 400);
		});

	});

});
