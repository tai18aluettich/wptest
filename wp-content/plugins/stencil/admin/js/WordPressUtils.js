
/**
 * StencilWordPressUtils
 * 
 * This utility class provides methods to integrate Stencil into the WordPress
 * plugin that is installed on a site.
 * 
 * It may be important in the future to have noted that there is a reason that
 * the name of this utils class doesn't match the fileroot (which is
 * unconventional, in that it's almost always the case that they do match).
 * 
 * The reason is that at the time of development, I thought there might be a
 * risk that another plugin (or WordPress natively) may have a class named
 * WordPressUtils.
 * 
 * So the leading namespace is to try and prevent any such collision.
 * 
 * @author  Oliver Nassar <oliver@getstencil.com>
 * @link    https://getstencil.com/stencil-for-wordpress
 * @note    ouefhdgi3rb3
 * @note    In WordPress v5.3.0 I noticed that when the Feature Image modal is
 *          hidden, the conventional Add Media modal is shown and then hidden,
 *          and then the Feature Image modal is again shown, it's actually a new
 *          view. This means that new views are constantly being drawn in 5.0.3
 *          (and perhaps earlier).
 *          As a result, the cid approach below in this class is quite useful.
 * @see     https://wordpress.stackexchange.com/questions/185271/how-to-add-new-tab-to-media-upload-manager-with-custom-set-of-images
 * @see     https://www.isitwp.com/add-custom-tab-to-featured-image-media-library-popup/
 * @see     https://www.ibenic.com/extending-wordpress-media-uploader-custom-tab/
 * @see     https://wordpress.stackexchange.com/questions/269099/how-to-capture-the-selectiontoggle-event-fired-by-wp-media
 * @see     https://wordpress.stackexchange.com/questions/167133/bind-event-on-media-gallery-elements-wordpress/167142#167142
 * @see     https://wordpress.stackexchange.com/questions/240802/list-of-available-events-for-wp-media
 * @see     https://developer.wordpress.org/reference/functions/media_upload_tabs/x
 * @see     https://www.interserver.net/tips/kb/fix-wordpress-error-sorry-file-type-not-permitted-security-reasons/
 * @see     https://caniuse.com/#feat=filereader
 * @see     https://wordpress.org/plugins/developers/readme-validator/
 * @see     https://wordpress.org/plugins/developers/add/
 * @see     https://wordpress.org/download/releases/
 * @see     https://wordpress.stackexchange.com/questions/269099/how-to-capture-the-selectiontoggle-event-fired-by-wp-media
 * @see     https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/
 * @see     https://wp-mix.com/wordpress-readme-txt-tricks/
 * @see     https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/
 * @version 1.11.2
 * @abstract
 */
window.StencilWordPressUtils = (function() {

    /**
     * Properties
     * 
     */

    /**
     * __$
     * 
     * @access  private
     * @var     null|jQuery (default: null)
     */
    var __$ = null;

    /**
     * __appPath
     * 
     * @access  private
     * @var     String (default: '/app?external&integration&wordPress')
     */
    var __appPath = '/app?external&integration&wordPress';

    /**
     * __frameEventListeners
     * 
     * @access  private
     * @var     Object (default: {})
     */
    var __frameEventListeners = {};

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
     * __iFrameAppendedToBody
     * 
     * @access  private
     * @var     Boolean (default: false)
     */
    var __iFrameAppendedToBody = false;

    /**
     * __iFrameElement
     * 
     * @access  private
     * @var     HTMLIFrameElement|null (default: null)
     */
    var __iFrameElement = null;

    /**
     * __iFrameLoaded
     * 
     * @access  private
     * @var     Boolean (default: false)
     */
    // var __iFrameLoaded = false;

    /**
     * __iFramePresentationMethod
     * 
     * @access  private
     * @var     String (default: 'reposition')
     */
    // var __iFramePresentationMethod = 'append';
    var __iFramePresentationMethod = 'reposition';

    /**
     * __mediaFrameUploader
     * 
     * @access  private
     * @var     Object (default: null)
     */
    var __mediaFrameUploader = null;

    /**
     * __menuItemCopy
     * 
     * @access  private
     * @var     String (default: 'Stencil')
     */
    var __menuItemCopy = 'Stencil';

    /**
     * __menuItemKey
     * 
     * @access  private
     * @var     String (default: 'stencil')
     */
    var __menuItemKey = 'stencil';

    /**
     * __pluginCSSNamespace
     * 
     * @access  private
     * @var     String (default: 'stncl')
     */
    var __pluginCSSNamespace = 'stncl';

    /**
     * __externalRequestID
     * 
     * @access  private
     * @var     null|String (default: null)
     */
    var __externalRequestID = null;

    /**
     * __string
     * 
     * @access  private
     * @var     String (default: 'StencilWordPressUtils')
     */
    var __string = 'StencilWordPressUtils';

    /**
     * __validStates
     * 
     * This array contains the strings/keys of the different states in the Media
     * Library that should show the Stencil tab. It's these tabs on the left:
     * https://i.imgur.com/HnuOY8k.png
     * 
     * @access  private
     * @var     Array
     */
    var __validStates = [

        /**
         * "Set Featured Image" tab
         * 
         * @see     https://i.imgur.com/PDGnlQZ.png
         */
        'featured-image',

        /**
         * "Create Gallery" tab
         * 
         * @see     https://i.imgur.com/sBPWHgS.png
         */
        'gallery',

        /**
         * "Insert Media" tab
         * 
         * @see     https://i.imgur.com/o9wUj1m.png
         */
        'insert',

        /**
         * General library modal view (as reproduced in Gutenberg installation)
         * 
         * @see     https://i.imgur.com/8kH1kKx.png
         */
        'library'
    ];

    /**
     * __version
     * 
     * @access  private
     * @var     String (default: '1.11.2')
     */
    var __version = '1.11.2';

    /**
     * Methods
     * 
     */

    /**
     * __addActionMessageListener
     * 
     * @note    The __iFrameElement check is because some events might be
     *          triggered without the iframe having been drawn if the user
     *          has a Stencil extension installed.
     * @access  private
     * @param   String action
     * @param   Function callback
     * @return  void
     */
    var __addActionMessageListener = function(action, callback) {
        window.addEventListener('message', function(event) {
            if (event === undefined) {
                return false;
            }
            if (event === null) {
                return false;
            }
            var data = event.data;
            if (data === undefined) {
                return false;
            }
            if (data === null) {
                return false;
            }
            if (data[0] !== '{') {
                return false;
            }
            try {
                var parsed = JSON.parse(data);
            } catch(e) {
                return false;
            }
            // if (__iFrameElement === null) {
            //     return false;
            // }
            // if (__iFrameLoaded === false) {
            //     return false;
            // }
            if (parsed.action === action) {
                if (parsed.erid === __externalRequestID) {
                    callback.apply(window, [event]);
                    return true;
                }
                return false;
            }
            return false;
        });
    };

    /**
     * __addAllEventsListener
     * 
     * @access  private
     * @param   Object modal
     * @return  Boolean
     */
    var __addAllEventsListener = function(modal) {
        if (__getRole() === 'dev') {
            return false;
        }
        if (__getRole() === 'prod') {
            return false;
        }
        var eventName = 'all',
            callback = function(eventName) {
                // console.log(eventName, this, arguments);
                // console.log(eventName);
            };
        __addFrameEventListener(modal, eventName, callback);
        return true;
    };

    /**
     * __addBackboneRoutingListener
     * 
     * @see     https://www.ibenic.com/extending-wordpress-media-uploader-custom-tab/
     * @access  private
     * @return  void
     */
    // var __addBackboneRoutingListener = function() {
    //     window.wp.media.view.MediaFrame.Select.prototype.browseRouter = function(routerView) {
    //         var items = __getMenuItems(routerView);
    //         routerView.set(items);
    //         if (items[__menuItemKey] === undefined) {
    //             __showMediaLibraryTab();
    //         }
    //     };
    // };

    /**
     * __addContentActivateListener
     * 
     * @access  private
     * @param   Object modal
     * @return  void
     */
    var __addContentActivateListener = function(modal) {
        var eventName = 'content:activate:' + (__menuItemKey),
            callback = function(eventName) {
                setTimeout(function() {
                    __showIFrame();
                }, 0);
            };
        __addFrameEventListener(modal, eventName, callback);
    };

    /**
     * __addContentDeactivateListener
     * 
     * @access  private
     * @param   Object modal
     * @return  void
     */
    var __addContentDeactivateListener = function(modal) {
        var eventName = 'content:deactivate:' + (__menuItemKey),
            callback = function(eventName) {
                __hideIFrame();
            };
        __addFrameEventListener(modal, eventName, callback);
    };

    /**
     * __addFeaturedImageToolbarActivateListener
     * 
     * @note    Not currently being used
     * @access  private
     * @param   Object modal
     * @return  void
     */
    // var __addFeaturedImageToolbarActivateListener = function(modal) {
    //     var eventName = 'toolbar:activate:featured-image',
    //         callback = function(eventName) {
    //             setTimeout(function() {
    //                 __showIFrame();
    //             }, 0);
    //         };
    //     __addFrameEventListener(modal, eventName, callback);
    // };

    /**
     * __addFrameEventListener
     * 
     * @note    cid refers to the open frame's (aka modal) view id
     * @access  private
     * @param   Object modal
     * @param   String eventName
     * @param   Function callback
     * @return  void
     */
    var __addFrameEventListener = function(modal, eventName, callback) {
        var cid = __getModalCID();
        __frameEventListeners[cid] = __frameEventListeners[cid] || {};
        __frameEventListeners[cid][eventName] = callback;
    };

    /**
     * __addMessageListeners
     * 
     * @access  private
     * @return  void
     */
    var __addMessageListeners = function() {
        __addActionMessageListener('importImages', __messageCallbacks.importImages);
        __addActionMessageListener('message.app.alive', __messageCallbacks.appAlive);
        __addActionMessageListener('message.app.opened', __messageCallbacks.appOpened);
    };

    /**
     * __addModalCloseListener
     * 
     * @access  private
     * @return  void
     */
    var __addModalCloseListener = function() {
        window.wp.media.view.Modal.prototype.on(
            'close',
            function() {
                __hideIFrame();
            }
        );
    };

    /**
     * __addModalOpenListener
     * 
     * @access  private
     * @return  void
     */
    // var __addModalOpenListener = function() {
    //     window.wp.media.view.Modal.prototype.on(
    //         'open',
    //         function(eventName) {
    //             StencilWordPressUtils.manage.modalOpen(this);
    //         }
    //     );
    // };

    /**
     * __addStencilBodyClass
     * 
     * @access  private
     * @return  void
     */
    var __addStencilBodyClass = function() {
        var namespace = __pluginCSSNamespace,
            className = namespace;
        __$('body').addClass(className);
    };

    /**
     * __addWindowResizeListener
     * 
     * @access  private
     * @return  void
     */
    var __addWindowResizeListener = function() {
        __$(window).resize(function() {
            __positionIFrame();
        });
    };

    /**
     * __checkForDefaultTab
     * 
     * @access  private
     * @return  void
     */
    var __checkForDefaultTab = function() {
        var $tab = __getStencilTabAnchorElement();
        if ($tab.hasClass('active') === true) {
            __showIFrame();
        }
    };

    /**
     * __getAppPath
     * 
     * @access  private
     * @return  String
     */
    var __getAppPath = function() {
        var path = __appPath,
            externalRequestID = __externalRequestID
        path += '&erid=' + (externalRequestID);
        return path;
    };

    /**
     * __getAppSRC
     * 
     * @access  private
     * @return  String
     */
    var __getAppSRC = function() {
        var host = __getHost(),
            path = __getAppPath(),
            src = 'https://' + (host) + (path);
        return src;
    };

    /**
     * __getDefaultMenuItems
     * 
     * @access  private
     * @return  Object
     */
    var __getDefaultMenuItems = function() {
        var l10n = window.wp.media.view.l10n,
            items = {
                upload: {
                    text: l10n.uploadFilesTitle,
                    priority: 20
                },
                browse: {
                    text: l10n.mediaLibraryTitle,
                    priority: 40
                }
            };
        return items;
    };

    /**
     * __getElementZIndex
     * 
     * @access  private
     * @param   HTMLElement element
     * @return  String
     */
    var __getElementZIndex = function(element) {
        var response = 'auto',
            zIndex,
            items = __$(element).parents().addBack().toArray(),
            index,
            item;
        for (index in items) {
            item = items[index];
            zIndex = __$(item).css('z-index');
            if (zIndex === 'auto') {
                continue;
            }
            if (zIndex === 'initial') {
                continue;
            }
            if (zIndex === 'inherit') {
                continue;
            }
            if (isNaN(zIndex) === true) {
                continue;
            }
            zIndex = parseInt(zIndex, 10);
            if (response === 'auto') {
                response = zIndex;
                continue;
            }
            if (zIndex > response) {
                response = zIndex;
                continue;
            }
        }
        return response;
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
     * __getIFrameHTMLElement
     * 
     * @access  private
     * @return  HTMLIFrameElement
     */
    var __getIFrameHTMLElement = function() {
        if (__iFrameElement === null) {
            __loadIFrame();
        }
        var element = __iFrameElement;
        return element;
    };

    /**
     * __getIFrameSRC
     * 
     * @access  private
     * @return  String
     */
    var __getIFrameSRC = function() {
        var src = __getAppSRC();
        return src;
    };

    /**
     * __getMediaModalContentElement
     * 
     * @access  private
     * @return  jQuery
     */
    var __getMediaModalContentElement = function() {
        var $mediaModalContent = __$('body .media-modal-content:visible');
        return $mediaModalContent;
    };

    /**
     * __getMediaLibraryTabAnchorElement
     * 
     * @access  private
     * @return  jQuery
     */
    var __getMediaLibraryTabAnchorElement = function() {
        var text = window.wp.media.view.l10n.mediaLibraryTitle,
            selector = 'a.media-menu-item:contains("' + (text) + '"):visible',
            $element = __$(selector);
        return $element;
    };

    /**
     * __getMenuItems
     * 
     * @access  private
     * @param   Object routerView
     * @return  Object
     */
    var __getMenuItems = function(routerView) {
        var items = __getDefaultMenuItems();
        if (__validStateForStencilTab(routerView) === true) {
            items[__menuItemKey] = {
                text: __menuItemCopy,
                priority: 60
            };
        }
        return items;
    };

    /**
     * __getModalCID
     * 
     * @note    cid refers to the open frame's (aka modal) view id
     * @access  private
     * @return  null|String
     */
    var __getModalCID = function() {
        var modal = __getModalReference();
        if (modal === null) {
            return null;
        }
        var cid = modal.cid;
        return cid;
    };

    /**
     * __getModalReference
     * 
     * @note    The et_pb_file_frame and file_frame checks are performed to
     *          account for the Divi Builder plugin (different versions).
     * @see     https://i.imgur.com/hRHamYE.jpg
     * @see     https://i.imgur.com/8he4M0L.png
     * @access  private
     * @return  Object|null
     */
    var __getModalReference = function() {
        var modal = window.wp.media.frame;
        if (modal !== undefined) {
            return modal;
        }
        modal = window.wp.media.frames.et_pb_file_frame;
        if (modal !== undefined) {
            return modal;
        }
        modal = window.wp.media.frames.file_frame;
        if (modal !== undefined) {
            return modal;
        }
        return null;
    };

    /**
     * __getRandomString
     * 
     * @access  private
     * @param   Number length
     * @return  String
     */
    var __getRandomString = function(length) {
        var str = '',
            range = '0123456789abcdefghijklmnopqrstuvwxyz',
            i = 0;
        for (i; i < length; i++) {
            str += range.charAt(Math.floor(Math.random() * range.length));
        }
        return str;
    };

    /**
     * __getRole
     * 
     * @access  private
     * @return  String
     */
    var __getRole = function() {
        if (window.location.host === 'local.getstencil.com') {
            return 'local';
        }
        if (window.location.host === 'dev.getstencil.com') {
            return 'dev';
        }
        return 'prod';
    };

    /**
     * __getStencilTabAnchorElement
     * 
     * @access  private
     * @return  jQuery
     */
    var __getStencilTabAnchorElement = function() {
        var text = __menuItemCopy,
            selector = 'a.media-menu-item:contains("' + (text) + '"):visible',
            $element = __$(selector);
        return $element;
    };

    /**
     * __getUploadMaxFilesize
     * 
     * @access  private
     * @return  null|String
     */
    var __getUploadMaxFilesize = function() {
        try {
            var filesize = window._wpPluploadSettings.defaults.filters.max_file_size;
            if (filesize === undefined) {
                return null;
            }
            if (filesize === null) {
                return null;
            }
            filesize = filesize.toString();
            if (filesize.match(/b$/i) !== null) {
                filesize = parseInt(filesize, 10);
                return filesize;
            }
            return null;
        } catch (err) {
        }
        return null;
    };

    /**
     * __hideIFrame
     * 
     * @access  private
     * @return  void
     */
    var __hideIFrame = function() {
        var namespace = __pluginCSSNamespace,
            className = (namespace) + '-body-open';
        __$('body').removeClass(className);
    };

    /**
     * __insertIFrameIntoTab
     * 
     * @access  private
     * @return  Boolean
     */
    var __insertIFrameIntoTab = function() {
        var element = __getIFrameHTMLElement();
        if (__iFramePresentationMethod === 'append') {
            var $mediaModalContent = __getMediaModalContentElement().last(),
                mediaFrameContentElement = $mediaModalContent.find('.media-frame-content').get(0);
            mediaFrameContentElement.appendChild(element);
            return true;
        }
        if (__iFrameAppendedToBody === true) {
            return false;
        }
        var $body = __$('body'),
            body = $body.get(0);
        body.appendChild(element);
        __iFrameAppendedToBody = true;
        return true;
    };

    /**
     * __io
     * 
     * @access  private
     * @var     Object
     */
    var __io = {

        /**
         * dataURLToBlob
         * 
         * @access  private
         * @param   String dataURL
         * @return  Blob
         */
        dataURLToBlob: function(dataURL) {
            var byteString;
            if (dataURL.split(',')[0].indexOf('base64') >= 0) {
                byteString = atob(dataURL.split(',')[1]);
            } else {
                byteString = unescape(dataURL.split(',')[1]);
            }
            var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0],
                ab = new ArrayBuffer(byteString.length),
                ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            try {
                return new Blob([ab], {type: mimeString});
            } catch (e) {
                var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder,
                    bb = new BlobBuilder();
                bb.append(ab);
                return bb.getBlob(mimeString);
            }
        },

        /**
         * getBlobFromURL
         * 
         * @access  private
         * @param   String url
         * @param   Function callback
         * @return  void
         */
        getBlobFromURL: function(url, callback) {
            __io.getDataURL(url, function(dataURL) {
                var blob = __io.dataURLToBlob(dataURL);
                callback(blob);
            });
        },

        /**
         * getDataURL
         * 
         * @access  private
         * @param   String url
         * @param   Function callback
         * @return  void
         */
        getDataURL: function(url, callback) {
            var image = new Image();
            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                canvas.getContext('2d').drawImage(this, 0, 0);
                callback(canvas.toDataURL('image/png'));
            };
            image.crossOrigin = 'anonymous';
            image.src = url;
        },

        /**
         * uploadBlob
         * 
         * @access  private
         * @param   Blob blob
         * @param   String filename
         * @return  void
         */
        uploadBlob: function(blob, filename) {
            var item = blob;
            if (window.File) {
                item = new File([blob], filename);
            }
            var view = __mediaFrameUploader;
            view.uploader.uploader.addFile(item);
        },

        /**
         * uploadDataURL
         * 
         * @access  private
         * @param   String dataURL
         * @param   String filename
         * @return  void
         */
        uploadDataURL: function(dataURL, filename) {
            var blob = __io.dataURLToBlob(dataURL);
            blob.name = filename;
            __io.uploadBlob(blob, filename);
        },

        /**
         * uploadURL
         * 
         * @access  private
         * @param   String url
         * @param   String filename
         * @return  void
         */
        uploadURL: function(url, filename) {
            __io.getBlob(url, function(blob) {
                blob.name = filename;
                __io.uploadBlob(blob, filename);
            })
        }
    };

    /**
     * __listenForAllFrameEvents
     * 
     * @note    cid refers to the open frame's (aka modal) view id
     * @access  private
     * @return  Boolean
     */
    var __listenForAllFrameEvents = function() {
        var cid = __getModalCID();
        if (__frameEventListeners[cid] !== undefined) {
            return false;
        }
        __frameEventListeners[cid] = {};
        __getModalReference().on('all', function(eventName) {
            if (__frameEventListeners[cid].all !== undefined) {
                __frameEventListeners[cid].all(eventName);
            }
            if (__frameEventListeners[cid][eventName] !== undefined) {
                __frameEventListeners[cid][eventName](eventName);
            }
        });
        return true;
    };

    /**
     * __loadIFrame
     * 
     * @access  private
     * @return  void
     */
    var __loadIFrame = function() {
        var element = document.createElement('iframe'),
            src = __getIFrameSRC(),
            namespace = __pluginCSSNamespace;
        element.setAttribute('name', (namespace) + '-wp');
        element.setAttribute('class', (namespace) + '-iframe');
        element.setAttribute('frameborder', '0');
        element.setAttribute('allowtransparency', 'true');
        element.setAttribute('src', src);
        // element.onload = function() {
        //     __iFrameLoaded = true;
        // };
        __iFrameElement = element;
    };

    /**
     * __log
     * 
     * @access  private
     * @param   String msg
     * @return  Boolean
     */
    var __log = function(msg) {
        if (window.console === undefined) {
            return false;
        }
        if (window.console.log === undefined) {
            return false;
        }
        window.console.log(msg);
        return true;
    };

    /**
     * __messageCallbacks
     * 
     * @access  private
     * @var     Object
     */
    var __messageCallbacks = {

        /**
         * appAlive
         * 
         * @access  private
         * @param   Object event
         * @return  void
         */
        appAlive: function(event) {
            var action = 'message.app.init',
                message = {
                    action: action,
                    erid: __externalRequestID
                };
            __postActionMessage(action, message);
        },

        /**
         * appOpened
         * 
         * @access  private
         * @param   Object event
         * @return  void
         */
        appOpened: function(event) {
            var action = 'message.app.params.store',
                message = {
                    action: action,
                    erid: __externalRequestID,
                    params: {
                        maxFilesize: __getUploadMaxFilesize()
                    }
                };
            __postActionMessage(action, message);
        },

        /**
         * importImages
         * 
         * @access  private
         * @param   Object event
         * @return  void
         */
        importImages: function(event) {
            var data = event.data,
                parsed = JSON.parse(data),
                images = parsed.data.images,
                image = images[0],
                dataURL = image.dataURL,
                filename = image.filename;
            __io.uploadDataURL(dataURL, filename);
            __showMediaLibraryTab();
        }
    };

    /**
     * __positionIFrame
     * 
     * @access  private
     * @return  Boolean
     */
    var __positionIFrame = function() {
        if (__iFramePresentationMethod === 'append') {
            return false;
        }
        if (__iFrameAppendedToBody === false) {
            return false;
        }
        var $mediaModalContent = __getMediaModalContentElement(),
            $parent = $mediaModalContent.find('.media-frame-content').last();
        if ($parent.length === 0) {
            return false;
        }
        var offset = $parent.offset(),
            element = __getIFrameHTMLElement();
        __setIFrameHTMLElementZIndex();
        __$(element).css({
            left: offset.left + 'px',
            top: (offset.top + 1) + 'px',
            width: $parent.width() + 'px',
            height: $parent.height() + 'px'
        });
        return true;
    };

    /**
     * __postActionMessage
     * 
     * @access  private
     * @param   String action
     * @param   Object message
     * @return  Boolean
     */
    var __postActionMessage = function(action, message) {
        var host = __getHost(),
            targetOrigin = 'https://' + (host);
        message = JSON.stringify(message);
        __iFrameElement.contentWindow.postMessage(message, targetOrigin);
        return true;
    };

    /**
     * __setExternalRequestID
     * 
     * @access  private
     * @return  void
     */
    var __setExternalRequestID = function() {
        var randomStr = __getRandomString(8),
          externalRequestID = 'erid' + (randomStr);
        __externalRequestID = externalRequestID;
    };

    /**
     * __setIFrameHTMLElementZIndex
     * 
     * @access  private
     * @return  void
     */
    var __setIFrameHTMLElementZIndex = function() {
        var iFrameHTMLElement = __getIFrameHTMLElement(),
            modal = __getMediaModalContentElement().get(0),
            zIndex = __getElementZIndex(modal);
        if (isNaN(zIndex) === false) {
            zIndex += 1
        }
        __$(iFrameHTMLElement).css({
            'z-index': zIndex
        });
    };

    /**
     * __setMediaFrameUploader
     * 
     * I found that in 5.0.3, sometimes (I was unreliably able to reproduce this
     * by toggling tabs, then switching sources of the modal, and then toggling
     * tabs before attempting an export) the object-key
     * ('.media-frame-uploader') wasn't available. But it seems to be available
     * upon each initial load of the modal.
     * 
     * So I track a reference to it when a modal is initially opened, just
     * incase.
     * 
     * @access  private
     * @return  Boolean
     */
    var __setMediaFrameUploader = function() {
        var modal = __getModalReference();
        if (modal === null) {
            return false;
        }
        var views = modal.views,
            uploaders = views._views['.media-frame-uploader'];
        if (uploaders === undefined) {
            return false;
        }
        var view = uploaders[0];
        __mediaFrameUploader = view;
        return true;
    };

    /**
     * __showIFrame
     * 
     * @access  private
     * @return  void
     */
    var __showIFrame = function() {
        var namespace = __pluginCSSNamespace,
            className = (namespace) + '-body-open';
        __$('body').addClass(className);
        __insertIFrameIntoTab();
        __positionIFrame();
    };

    /**
     * __showMediaLibraryTab
     * 
     * @see     https://i.imgur.com/pRJT1Vf.png
     * @access  private
     * @return  void
     */
    var __showMediaLibraryTab = function() {
        var $element = __getMediaLibraryTabAnchorElement();
        $element.trigger('click');
    };

    /**
     * __valid
     * 
     * @access  private
     * @return  Boolean
     */
    var __valid = function() {
        var scopes = [
                'window.wp.media',
                'window.wp.media.view.Modal.prototype.on'
            ],
            index,
            scope;
        for (index in scopes) {
            scope = scopes[index];
            if (__validReference(scope) === false) {
                return false;
            }
        }
        return true;
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

    /**
     * __validStateForStencilTab
     * 
     * @access  private
     * @param   Object routerView
     * @return  Boolean
     */
    var __validStateForStencilTab = function(routerView) {
        var controller = routerView.controller,
            state = controller._state;
        if (__validStates.indexOf(state) !== -1) {
            return true;
        }
        return false;
    };

    // Public
    return {

        /**
         * init
         * 
         * @access  public
         * @param   jQuery $
         * @return  Boolean
         */
        init: function($) {
            __$ = $;
            if (__valid() === false) {
                return false;
            }
            __setExternalRequestID();
            __addStencilBodyClass();
            __addMessageListeners();
            // __addBackboneRoutingListener();
            __addModalCloseListener();
            // __addModalOpenListener();
            __addWindowResizeListener();
            return true;
        },

        /**
         * manage
         * 
         * @access  public
         * @var     Object
         */
        manage: {

            /**
             * browseRouter
             * 
             * @access  public
             * @param   Object routerView
             * @return  void
             */
            browseRouter: function(routerView) {
                var items = __getMenuItems(routerView);
                routerView.set(items);
                if (items[__menuItemKey] === undefined) {
                    __showMediaLibraryTab();
                }
            },

            /**
             * modalOpen
             * 
             * @access  public
             * @param   Object modal
             * @return  Boolean
             */
            modalOpen: function(modal) {
                var set = __setMediaFrameUploader();
                if (set === false) {
                    var msg = 'Could not set media frame uploader';
                    __log(msg);
                    return false;
                }
                __listenForAllFrameEvents();
                __addAllEventsListener(modal);
                __addContentActivateListener(modal);
                __addContentDeactivateListener(modal);
                __checkForDefaultTab();
                return true;
            }
        },

        /**
         * proxy
         * 
         * @access  public
         * @param   String fn
         * @return  mixed
         */
        proxy: function(fn) {
            var str = (fn) + '()',
                response = eval(str);
            return response;
        },

        /**
         * version
         * 
         * @access  public
         * @return  String
         */
        version: function() {
            var version = __version;
            return version;
        }
    };
})();
