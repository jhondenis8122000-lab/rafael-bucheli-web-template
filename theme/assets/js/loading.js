/**
 * LOADING CONTROL - EDIFICATION TEMPLATE
 * Video loading with fallback spinner
 */

(function($) {
    'use strict';
    
    // Configuration
    const CONFIG = {
        MIN_LOADING_TIME: 2000,     // Minimum 2 seconds
        MAX_LOADING_TIME: 7000,     // Maximum 7 seconds (safety timeout)
        FADE_DURATION: 700,         // Fade out duration
        DEBUG: false                // Set to true for console logs
    };
    
    let startTime;
    let loadingTimeout;
    let progressInterval;
    
    /**
     * Initialize loading system
     */
    function initLoading() {
        if (CONFIG.DEBUG) console.log('🚀 Initializing Edification loading...');
        
        startTime = Date.now();
        setupVideoListeners();
        setupFallback();
        startProgressSimulation();
        
        // Handle page load
        $(window).on('load', handlePageLoaded);
        
        // Safety timeout
        loadingTimeout = setTimeout(function() {
            if (CONFIG.DEBUG) console.log('⏰ Safety timeout reached');
            hidePreloader();
        }, CONFIG.MAX_LOADING_TIME);
    }
    
    /**
     * Setup video event listeners
     */
    function setupVideoListeners() {
        const video = $('.video-loader video')[0];
        
        if (video) {
            // When video metadata is loaded
            video.addEventListener('loadedmetadata', function() {
                if (CONFIG.DEBUG) {
                    console.log('📊 VIDEO INFO:');
                    console.log('⏱️ Duration:', this.duration.toFixed(2), 'seconds');
                    console.log('📏 Resolution:', this.videoWidth + 'x' + this.videoHeight);
                }
            });
            
            // When video data is loaded
            video.addEventListener('loadeddata', function() {
                if (CONFIG.DEBUG) console.log('✅ Video loaded successfully');
                // Try to play the video
                video.play().catch(function(e) {
                    if (CONFIG.DEBUG) console.log('⚠️ Video play error:', e);
                });
            });
            
            // Video error handling
            video.addEventListener('error', function() {
                if (CONFIG.DEBUG) console.log('❌ Video error, showing fallback');
                showFallback();
            });
            
            // Preload the video
            video.load();
        } else {
            if (CONFIG.DEBUG) console.log('📹 Video element not found');
            showFallback();
        }
    }
    
    /**
     * Setup fallback system
     */
    function setupFallback() {
        const video = $('.video-loader video');
        const fallback = $('.fallback-loader');
        
        // Hide fallback initially
        fallback.hide();
        
        // Check if video exists and has source
        if (video.length === 0 || !video.attr('src')) {
            setTimeout(function() {
                showFallback();
            }, 1500);
        }
    }
    
    /**
     * Show fallback spinner
     */
    function showFallback() {
        const video = $('.video-loader video');
        const fallback = $('.fallback-loader');
        
        video.hide();
        fallback.show();
        
        if (CONFIG.DEBUG) console.log('🔄 Showing fallback spinner');
    }
    
    /**
     * Simulate loading progress
     */
    function startProgressSimulation() {
        const progressElement = $('.loading-progress');
        
        if (progressElement.length) {
            let progress = 0;
            
            progressInterval = setInterval(function() {
                progress += Math.random() * 8 + 2; // 2-10% increments
                if (progress > 95) progress = 95;
                
                progressElement.text(`Loading ${Math.round(progress)}%`);
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 150);
        }
    }
    
    /**
     * Handle when page is fully loaded
     */
    function handlePageLoaded() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, CONFIG.MIN_LOADING_TIME - elapsedTime);
        
        if (CONFIG.DEBUG) {
            console.log(`📈 Page loaded in ${elapsedTime}ms`);
            console.log(`⏳ Waiting ${remainingTime}ms before hiding`);
        }
        
        // Clear safety timeout
        if (loadingTimeout) clearTimeout(loadingTimeout);
        
        // Clear progress interval
        if (progressInterval) clearInterval(progressInterval);
        
        // Wait minimum time before hiding
        setTimeout(function() {
            hidePreloader();
        }, remainingTime);
    }
    
    /**
     * Hide preloader with animation
     */
    function hidePreloader() {
        const preloader = $('#preloader');
        const video = $('.video-loader video')[0];
        
        if (!preloader.length) {
            if (CONFIG.DEBUG) console.log('❌ Preloader not found');
            return;
        }
        
        // Stop video if playing
        if (video && !video.paused) {
            video.pause();
            if (CONFIG.DEBUG) console.log('⏸️ Video paused');
        }
        
        // Update progress to 100%
        const progressElement = $('.loading-progress');
        if (progressElement.length) {
            progressElement.text('Loading 100%');
        }
        
        // Fade out animation
        preloader.addClass('fade-out');
        
        if (CONFIG.DEBUG) console.log('✨ Hiding preloader...');
        
        // Remove from DOM after animation
        setTimeout(function() {
            preloader.remove();
            if (CONFIG.DEBUG) console.log('✅ Preloader removed');
            
            // Trigger custom event
            $(document).trigger('loading:complete');
            
        }, CONFIG.FADE_DURATION);
    }
    
    /**
     * Public function to hide loading manually
     */
    window.hideEdificationLoading = function() {
        hidePreloader();
    };
    
    /**
     * Public function to show loading manually (if needed)
     */
    window.showEdificationLoading = function() {
        // Could be implemented for AJAX calls
        console.log('Show loading function available for custom use');
    };
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        initLoading();
    });
    
})(jQuery);