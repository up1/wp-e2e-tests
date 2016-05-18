import assert from 'assert';
import test from 'selenium-webdriver/testing';
import config from 'config';

import LoginFlow from '../lib/flows/login-flow.js';

import EditorPage from '../lib/pages/editor-page.js';

import * as driverManager from '../lib/driver-manager.js';
import * as mediaHelper from '../lib/media-helper.js';

const mochaTimeOut = config.get( 'mochaTimeoutMS' );
const startBrowserTimeoutMS = config.get( 'startBrowserTimeoutMS' );
const screenSize = driverManager.currentScreenSize();

var driver;

test.before( 'Start Browser', function() {
	this.timeout( startBrowserTimeoutMS );
	driver = driverManager.startBrowser();
} );

test.describe( 'Editor: Media Upload (' + screenSize + ')', function() {
	this.timeout( mochaTimeOut );

	test.describe( 'Image Upload:', function() {
		this.bailSuite( true );
		let editorPage;

		test.before( 'Delete Cookies and Local Storage', function() {
			driverManager.clearCookiesAndDeleteLocalStorage( driver );
		} );

		test.describe( 'Can upload many media types', () => {

			test.before( 'Can log in and navigate to Editor page', () => {
				const loginFlow = new LoginFlow( driver );
				loginFlow.loginAndStartNewPage();
				editorPage = new EditorPage( driver );
			} );

			test.describe( 'Can upload a normal image', function() {
				let fileDetails;

				test.before( 'Create image file for upload', function() {
					mediaHelper.createFileWithFilename( 'normal.jpg' ).then( function( details ) {
						fileDetails = details;
					} );
				} );

				test.it( 'Can upload an image', function() {
					editorPage.uploadMediaAndInsert( fileDetails );
				} );

				test.after( function() {
					if ( fileDetails ) {
						mediaHelper.deleteFile( fileDetails ).then( function() {} );
					}
				} );

			} );

			test.describe( 'Can upload an image with reserved url chars in the filename', function() {
				let fileDetails;

				test.before( 'Create image file for upload', function() {
					mediaHelper.createFileWithFilename( 'filewith#?#?reservedurlchars.jpg' ).then( function( details ) {
						fileDetails = details;
					} );
				} );

				test.it( 'Can upload an image', function() {
					editorPage.uploadMediaAndInsert( fileDetails );
				} );

				test.after( function() {
					if ( fileDetails ) {
						mediaHelper.deleteFile( fileDetails ).then( function() {} );
					}
				} );
			} );

			test.describe( 'Can upload an mp3', function() {
				let fileDetails;

				test.before( 'Create mp3 for upload', function() {
					mediaHelper.createFileWithFilename( 'fake.mp3' ).then( function( details ) {
						fileDetails = details;
					} );
				} );

				test.it( 'Can upload an mp3', function() {
					editorPage.uploadMediaAndInsert( fileDetails );
				} );

				test.after( function() {
					if ( fileDetails ) {
						mediaHelper.deleteFile( fileDetails ).then( function() {} );
					}
				} );
			} );
		} );
	} );
} );
