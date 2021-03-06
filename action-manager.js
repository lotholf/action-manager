/**
 * ActionManager JavaScript Library v0.1
 *
 * Copyright 2012, Adrian Gaudebert
 * Licensed under the MIT license.
 *
 */

(function(exports) {

    /**
     * Class ActionManager
     *
     * Handle actions.
     *
     * @author Adrian Gaudebert - adrian@gaudebert.fr
     * @constructor
     */
    function ActionManager() {

        /**
         * List of all the available actions (in their modules).
         *
         * Example use:
         *      actionManager.actions.unit.move(unitID, cellID);
         *  will call the function move() of the unit module, passing as
         *  parameters two identifiers of objects of the game.
         */
        var actionsList = this.actions = {};

        /**
         * Add a list of actions from a module to the current dictionary of
         * actions. Use the module name as a namespace for all actions.
         */
        this.addActions = function(module, actions) {
            if (typeof actions == "undefined" || actions === null || actions.length == 0) {
                return false;
            }

            // Create the module
            var namespace = actionsList[module] = {};

            for (var a in actions) {
                // Create an action object that has all properties and is callable
                var Action = function() {};
                Action.prototype = Function.prototype;

                var act = new Action(),
                    action;
                act.check = actions[a].check;
                act.execute = actions[a].execute;
                act.actionName = a;
                act.module = module;

                (function(act) {
                    action = function() {
                        if (act.check.apply(act, arguments)) {
                            act.execute.apply(act, arguments);
                            return true;
                        }
                        return false;
                    };
                })(act);
                action.__proto__ = act;

                // Now action can be used in those ways:
                // action(); -> call check() and if true call execute()
                // action.check()
                // action.execute()

                namespace[a] = action;
            }
        };
    }

    exports.ActionManager = ActionManager;

})(typeof exports === 'undefined' ? this['exports'] = {} : exports);
