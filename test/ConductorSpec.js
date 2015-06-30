// eslint-disable no-new
// jscs:disable maximumLineLength

'use strict';

var _      = require('lodash');
var assert = require('assert');
var rc    = require('../lib');
var Model  = require('../lib/models/Model');


describe('Restify Conductor', function() {

    describe('constructor tests', function() {

        it('should throw if no options passed to constructor', function() {
            assert.throws(function() {
                rc.createConductor();
            });
        });


        it('should throw if no name specified in constructor', function() {
            assert.throws(function() {
                rc.createConductor({
                    title: 'A',
                    props: _.noop
                });
            });
        });


        it('should create internal props using passed in config', function() {
            var conductorA = rc.createConductor({
                    name: 'A',
                    props: function() {
                        return {
                            title: 'A',
                            numbers: [1, 2, 3],
                            fastProperties: {
                                a: 'A'
                            }
                        };
                    }
                });

            assert.deepEqual(conductorA.getProps('title'), 'A');
            assert.deepEqual(conductorA.getProps('numbers'), [1, 2, 3]);
            assert.deepEqual(conductorA.getProps('fastProperties'), { a: 'A' });
        });
    });

    describe('handler tests', function() {

        function A(innerReq, innerRes, next) {
            next();
        }

        function B(innerReq, innerRes, next) {
            next();
        }

        function C(innerReq, innerRes, next) {
            next();
        }

        it('should take an array of handlers', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                handlers: [ A ]
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ],
                handlers: [ B ]
            });

            var handlerStackA = conductorA.getDebugHandlerStack();
            assert.equal(handlerStackA[0], '0-A');

            var handlerStackB = conductorB.getDebugHandlerStack();
            assert.equal(handlerStackB[0], '0-A');
            assert.equal(handlerStackB[1], '0-B');
        });

        it('should take an array of array of handlers', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                handlers: [
                    [ A ],
                    [ B ]
                ]
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ],
                handlers: [
                    [ C ]
                ]
            });

            var handlerStackA = conductorA.getDebugHandlerStack();
            assert.equal(handlerStackA[0], '0-A');
            assert.equal(handlerStackA[1], '1-B');

            var handlerStackB = conductorB.getDebugHandlerStack();
            assert.equal(handlerStackB[0], '0-A');
            assert.equal(handlerStackB[1], '0-C');
            assert.equal(handlerStackB[2], '1-B');
        });

        it('should take a numerically keyed object of arrays', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                handlers: {
                    10: [ A ]
                }
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ],
                handlers: {
                    30: [ C ]
                }
            });
            var conductorC = rc.createConductor({
                name: 'C',
                deps: [ conductorB ],
                handlers: {
                    20: [ B ]
                }
            });

            var handlerStack = conductorC.getDebugHandlerStack();
            assert.equal(handlerStack[0], '10-A');
            assert.equal(handlerStack[1], '20-B');
            assert.equal(handlerStack[2], '30-C');
        });

        it('should retrieve handler blocks', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                handlers: {
                    10: [ A ]
                }
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ],
                handlers: {
                    30: [ C ]
                }
            });
            var conductorC = rc.createConductor({
                name: 'C',
                deps: [ conductorB ],
                handlers: {
                    20: [ B ]
                }
            });

            assert.deepEqual(conductorA.getHandlers(10), [ A ]);
            assert.deepEqual(conductorB.getHandlers(10), [ A ]);
            assert.deepEqual(conductorB.getHandlers(30), [ C ]);
            assert.deepEqual(conductorC.getHandlers(10), [ A ]);
            assert.deepEqual(conductorC.getHandlers(30), [ C ]);
            assert.deepEqual(conductorC.getHandlers(20), [ B ]);
        });

        it('should throw when retrieving handler blocks', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                handlers: {
                    10: [ A ]
                }
            });

            assert.throws(function() {
                conductorA.getHandlers(5);
            });

            assert.throws(function() {
                conductorA.getHandlers();
            });
        });

        it('should return sorted handler block keys', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                handlers: {
                    5: [ A ]
                }
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ],
                handlers: {
                    0: [ C ]
                }
            });
            var conductorC = rc.createConductor({
                name: 'C',
                deps: [ conductorB ],
                handlers: {
                    100: [ B ]
                }
            });

            assert.deepEqual(conductorC.getHandlerKeys(), [0, 5, 100]);
        });
    });


    describe('props and first class property tests', function() {
        it('should resolve properties on an conductor', function() {
            var configA = {
                name: 'A',
                props: function(inheritedProps) {
                    assert.deepEqual(inheritedProps, {});
                    return {
                        title: 'A',
                        models: [ {modelA: 'A'} ],
                        fastProperties: {
                            a: 'A'
                        }
                    };
                }
            };
            var conductorA = rc.createConductor(configA);

            assert.equal(conductorA.name, configA.name);
            assert.equal(conductorA.getProps('title'), 'A');
            assert.deepEqual(conductorA.getProps('models'), [ { modelA: 'A' } ]);
        });

        it('should override props from parent', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                props: function() {
                    return {
                        letters: {
                            a: 1
                        },
                        numbers: [1, 2, 3]
                    };
                }
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ],
                props: function() {
                    return {
                        letters: {
                            b: 2
                        },
                        numbers: [4, 5, 6]
                    };
                }
            });

            assert.deepEqual(conductorB.getProps('letters'), { b: 2 });
            assert.deepEqual(conductorB.getProps('numbers'), [4, 5, 6]);
        });

        it('should resolve parent props from child conductor', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                props: function() {
                    return {
                        letters: {
                            a: 1
                        },
                        numbers: [1, 2, 3]
                    };
                }
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ]
            });

            assert.deepEqual(conductorB.getProps('letters'), { a: 1 });
            assert.deepEqual(conductorB.getProps('numbers'), [1, 2, 3]);
        });

        it('should extend parent props from child conductor', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                props: function() {
                    return {
                        letters: {
                            a: 1
                        },
                        numbers: [1, 2, 3]
                    };
                }
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ],
                extendProps: [ 'letters', 'numbers' ],
                props: function(inheritedProps) {
                    assert.deepEqual(inheritedProps, conductorA.getProps());
                    return _.merge({}, inheritedProps, {
                        letters:{
                            b: 2
                        },
                        numbers: [4, 5, 6]
                    }, function mergeCustomizer(a, b) {
                        if (_.isArray(a)) {
                            return a.concat(b);
                        }
                    });
                }
            });

            assert.deepEqual(conductorB.getProps('letters'), { a: 1, b: 2 });
            assert.deepEqual(conductorB.getProps('numbers'), [1, 2, 3, 4, 5, 6]);
        });

        it('should not mutate parent props', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                props: function() {
                    return {
                        letters: {
                            a: 1
                        }
                    };
                }
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ],
                extendProps: [ 'letters', 'numbers' ],
                props: function(inheritedProps) {
                    assert.deepEqual(inheritedProps, conductorA.getProps());
                    return _.merge(inheritedProps, {
                        letters:{
                            b: 2
                        }
                    });
                }
            });

            assert.deepEqual(conductorA.getProps('letters'), { a: 1 });
            assert.deepEqual(conductorB.getProps('letters'), { a: 1, b: 2 });
        });
    });

    describe('model tests', function() {

        it('should return models', function() {
            var conductorA = rc.createConductor({
                name: 'A',
                models: {
                    a: [
                        function browserInfoModel(innerReq, res) {
                            return new Model({
                                name: 'browserInfo',
                                get: function(cb) {
                                    cb(null, {
                                        ua: innerReq.headers['user-agent']
                                    });
                                },
                                isValid: function(data) {
                                    return typeof data === 'string';
                                }
                            });
                        }
                    ]
                }
            });
            var conductorB = rc.createConductor({
                name: 'B',
                deps: [ conductorA ],
                models: {
                    a: [
                        function fooModel(innerReq, res) {
                            return new Model({
                                name: 'foo',
                                get: function(cb) {
                                    cb(null, {
                                        ua: innerReq.query.foo
                                    });
                                }
                            });
                        }
                    ],
                    b: [
                        function timestampModel(innerReq, res) {
                            return new Model({
                                name: 'timestamp',
                                get: function(cb) {
                                    cb(null, Date.now());
                                }
                            });
                        }
                    ]
                }
            });
            var req = {
                query: {
                    foo: 'bar'
                }
            };

            var modelsA = conductorB.createModels(req, {}, 'a');
            var modelsB = conductorB.createModels(req, {}, 'b');
            assert.equal(modelsA.length, 2);
            assert.equal(modelsA[0].name, 'browserInfo');
            assert.equal(modelsA[1].name, 'foo');
            assert.equal(modelsB.length, 1);
            assert.equal(modelsB[0].name, 'timestamp');
        });

    });
});