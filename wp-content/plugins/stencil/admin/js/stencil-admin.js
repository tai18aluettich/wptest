
/**
 * (anonymous)
 * 
 * @author  Oliver Nassar <oliver@getstencil.com>
 * @link    https://getstencil.com/stencil-for-wordpress
 * @see     TurtlePHP/application/webroot/blog/wp-config.php
 * @see     TurtlePHP/application/webroot/blog/wp-includes/js/dist/edit-post.js
 * @see     TurtlePHP/application/webroot/blog/wp-includes/js/dist/editor.js
 * @see     TurtlePHP/application/webroot/blog/wp-includes/js/dist/media-views.js
 * @see     https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
 * @version 1.11.2
 */
(function($) {
    'use strict';

    /**
     * All of the code for your admin-facing JavaScript source
     * should reside in this file.
     *
     * Note: It has been assumed you will write jQuery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * This enables you to define handlers, for when the DOM is ready:
     *
     * $(function() {
     *
     * });
     *
     * When the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * Ideally, it is not considered best practise to attach more than a
     * single DOM-ready or window-load handler for a particular page.
     * Although scripts in the WordPress core, Plugins and Themes may be
     * practising this, we should strive to set a better example in our own work.
    */

    /**
     * StencilWordPressAdmin
     * 
     * @abstract
     */
    var StencilWordPressAdmin = (function() {

        /**
         * Properties
         * 
         */

        /**
         * __compiledWordPressPath
         * 
         * @access  private
         * @var     String (default: '/app/static/compiled/wordPress.js')
         */
        var __compiledWordPressPath = '/app/static/compiled/wordPress.js';

        /**
         * __filenames
         * 
         * @access  private
         * @var     Object
         */
        var __filenames = {
            admin: 'stencil-admin.js',
            wordPressUtils: 'WordPressUtils.js'
        };

        /**
         * __hosts
         * 
         * @access  private
         * @var     Object
         */
        var __hosts = {
            local: 'local.getstencil.com',
            dev: 'dev.getstencil.com',
            prod: 'getstencil.com'
        };

        /**
         * __messages
         * 
         * @access  private
         * @var     Object
         */
        var __messages = {
            failed: 'Could not load Stencil. Please contact ' +
                'support@getstencil.com for help.'
        };

        /**
         * __overrideIntervalCheckDuration
         * 
         * @access  private
         * @var     Number (default: 10)
         */
        var __overrideIntervalCheckDuration = 10;

        /**
         * __timeout
         * 
         * @access  private
         * @var     Number (default: 5000)
         */
        var __timeout = 5000;

        /**
         * Methods
         * 
         */

        /**
         * __attempt
         * 
         * @access  private
         * @param   Function closure
         * @return  mixed|null
         */
        var __attempt = function(closure) {
            try {
                var response = closure();
                return response;
            } catch (err) {
            }
            return null;
        };

        /**
         * __callbacks
         * 
         * @access  private
         * @var     Object
         */
        var __callbacks = {

            /**
             * error
             * 
             * @access  private
             * @return  Boolean
             */
            error: function() {
                var editPostPage = window.location.pathname.indexOf('wp-admin/post.php') !== -1;
                if (editPostPage === false) {
                    return false;
                }
                var msg = __messages.failed;
                alert(msg);
                return true;
            },

            /**
             * success
             * 
             * @access  private
             * @return  void
             */
            success: function() {
                window.StencilWordPressUtils.init($);
            }
        };

        /**
         * __getHost
         * 
         * @access  private
         * @return  String
         */
        var __getHost = function() {
            var role = __getRole(),
                hosts = __hosts,
                host = hosts[role];
            return host;
        };

        /**
         * __getHour
         * 
         * @access  private
         * @return  String
         */
        var __getHour = function() {
            var currentDate = new Date(),
                hour = currentDate.getDate() + '/'
                    + (currentDate.getMonth() + 1)  + '/'
                    + currentDate.getFullYear() + '@'
                    + currentDate.getHours() + ':'
                    + '00:'
                    + '00';
            return hour;
        };

        /**
         * __getLocalWordPressScriptPath
         * 
         * @access  private
         * @return  null|String
         */
        var __getLocalWordPressScriptPath = function() {
            var role = __getRole(),
                path = __attempt(__getPluginWordPressUtilsPath);
            if (path === null) {
                return null;
            }
            if (role === 'local') {
                path = __compiledWordPressPath;
            }
            var queryString = __getQueryString();
            path = (path) + '?' + (queryString);
            return path;
        };

        /**
         * __getPluginVersion
         * 
         * @access  private
         * @return  null|String
         */
        var __getPluginVersion = function() {
            var adminFilename = __filenames.admin,
                src = $('script[src*="' + (adminFilename) + '"]').first().attr('src'),
                matches = src.match(/ver=([0-9\.]+)/);
            if (matches === null) {
                return null;
            }
            var version = matches.pop();
            return version;
        };

        /**
         * __getPluginWordPressUtilsPath
         * 
         * @access  private
         * @return  String
         */
        var __getPluginWordPressUtilsPath = function() {
            var adminFilename = __filenames.admin,
                wordPressUtilsFilename = __filenames.wordPressUtils,
                src = $('script[src*="' + (adminFilename) + '"]').first().attr('src');
            src = src.replace(adminFilename, wordPressUtilsFilename);
            var host = window.location.host;
            src = src.split(host).pop();
            return src;
        };

        /**
         * __getQueryData
         * 
         * @access  private
         * @return  Object
         */
        var __getQueryData = function() {
            var queryData = {
                hour: __getHour(),
                timezone: __getTimezone(),
                version: __getPluginVersion()
            };
            if (queryData.version === null) {
                delete queryData.version;
            }
            return queryData;
        };

        /**
         * __getQueryString
         * 
         * @access  private
         * @return  String
         */
        var __getQueryString = function() {
            var queryData = __getQueryData(),
                queryString = jQuery.param(queryData);
            return queryString;
        };

        /**
         * __getRemoteWordPressScriptURL
         * 
         * @access  private
         * @return  String
         */
        var __getRemoteWordPressScriptURL = function() {
            var host = __getHost(),
                path = __compiledWordPressPath,
                queryString = __getQueryString(),
                url = 'https://' + (host) + (path) + '?' + (queryString);
            return url;
        };

        /**
         * __getRole
         * 
         * @access  private
         * @return  String
         */
        var __getRole = function() {
            if (window.location.host === 'local.getstencil.com') {
                var role = 'local';
                return role;
            }
            if (window.location.host === 'dev.getstencil.com') {
                var role = 'dev';
                return role;
            }
            var role = 'prod';
            return role;
        };

        /**
         * __getTimezone
         * 
         * @see     https://stackoverflow.com/questions/1954397/detect-timezone-abbreviation-using-javascript
         * @see     https://stackoverflow.com/a/34405528/115025
         * @access  private
         * @return  String
         */
        var __getTimezone = function() {
            var currentDate = new Date(),
                lang = 'en-us',
                localeTimeString = currentDate.toLocaleTimeString(lang, {
                    timeZoneName: 'short'
                }),
                pieces = localeTimeString.split(' '),
                timezone = 'unknown';
            if (pieces.length > 2) {
                timezone = pieces[2];
            }
            return timezone;
        };

        /**
         * __loadLocalWordPressScript
         * 
         * @access  private
         * @param   Function error
         * @return  void
         */
        var __loadLocalWordPressScript = function(error) {
            var path = __getLocalWordPressScriptPath(),
                url = path,
                success = __callbacks.success;
            if (path === null) {
                error();
            } else {
                __loadScript(url, success, error);
            }
        };

        /**
         * __loadRemoteWordPressScript
         * 
         * @access  private
         * @param   Function error
         * @return  void
         */
        var __loadRemoteWordPressScript = function(error) {
            var url = __getRemoteWordPressScriptURL(),
                success = __callbacks.success;
            __loadScript(url, success, error);
        };

        /**
         * __loadScript
         * 
         * @see     https://api.jquery.com/jquery.getscript/
         * @access  private
         * @param   String url
         * @param   Function success
         * @param   Function error
         * @return  void
         */
        var __loadScript = function(url, success, error) {
            $.ajax({
                cache: true,
                dataType: 'script',
                error: error,
                success: success,
                timeout: __timeout,
                url: url
            });
        };

        /**
         * __loadWordPressScript
         * 
         * @access  private
         * @return  void
         */
        var __loadWordPressScript = function() {
            var error = function() {
                var error = __callbacks.error;
                __loadLocalWordPressScript(error);
            };
            __loadRemoteWordPressScript(error);
        };

        /**
         * __override
         * 
         * @access  private
         * @var     Object
         */
        var __override = {

            /**
             * browseRouter
             * 
             * @access  private
             * @return  void
             */
            browseRouter: function() {
                var scope = 'window.wp.media.view.MediaFrame.Select.prototype.browseRouter',
                    callback = function() {
                        window.wp.media.view.MediaFrame.Select.prototype.browseRouter = function(routerView) {
                            StencilWordPressUtils.manage.browseRouter(
                                routerView
                            );
                        };
                    };
                __override.reference(scope, callback);
            },

            /**
             * modalOpen
             * 
             * @access  private
             * @return  void
             */
            modalOpen: function() {
                var scope = 'window.wp.media.view.Modal.prototype.on',
                    callback = function() {
                        window.wp.media.view.Modal.prototype.on(
                            'open',
                            function() {
                                StencilWordPressUtils.manage.modalOpen(this);
                            }
                        );
                    };
                __override.reference(scope, callback);
            },

            /**
             * reference
             * 
             * @access  private
             * @param   String scope
             * @param   Function callback
             * @return  void
             */
            reference: function(scope, callback) {
                var interval,
                    check = function() {
                        if (__validReference(scope) === true) {
                            clearInterval(interval);
                            callback();
                        }
                    },
                    intervalCheckDuration = __overrideIntervalCheckDuration;
                interval = setInterval(check, intervalCheckDuration);
            }
        };

        /**
         * _validReference
         * 
         * @access  private
         * @param   String str
         * @return  Boolean
         */
        var __validReference = function(str) {
            var pieces = str.split('.'),
                index,
                reference = window;
            for (index in pieces) {
                if (isNaN(index) === true) {
                    continue;
                }
                reference = reference[pieces[index]];
                if (reference === undefined) {
                    return false;
                }
                if (reference === null) {
                    return false;
                }
            }
            return true;
        };

        // Public
        return {

            /**
             * Methods
             * 
             */

            /**
             * init
             * 
             * @note    The override methods are required to be called in this
             *          (stencil-admin.js) file rather than the loaded
             *          WordPressUtils.js file because in the newest WordPress
             *          (5.0.3), the "Set featured image" in the right column
             *          of a post/page is actually instantiated before the
             *          WordPressUtils.js file is loaded.
             *          This means that the prototype objects/references aren't
             *          overridden at the time that specific MediaFrame view
             *          objects are made, which results in the code not properly
             *          running in time.
             * @access  public
             * @return  void
             */
            init: function() {
                __override.browseRouter();
                __override.modalOpen();
                $(document).ready(function($) {
                    __loadWordPressScript();
                });
            }
        };
    })();

    // We landed on the moon!
    StencilWordPressAdmin.init();
})(jQuery);
