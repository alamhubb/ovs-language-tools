import traverse from '@babel/traverse';

const ast = {
    "type": "Program",
    "start": 0,
    "end": 79,
    "loc": {
        "start": {
            "line": 1,
            "column": 0,
            "index": 0
        },
        "end": {
            "line": 5,
            "column": 1,
            "index": 79
        }
    },
    "sourceType": "module",
    "interpreter": null,
    "body": [
        {
            "type": "ExportDefaultDeclaration",
            "start": 0,
            "end": 79,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0,
                    "index": 0
                },
                "end": {
                    "line": 5,
                    "column": 1,
                    "index": 79
                }
            },
            "declaration": {
                "type": "ClassDeclaration",
                "start": 15,
                "end": 79,
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 15,
                        "index": 15
                    },
                    "end": {
                        "line": 5,
                        "column": 1,
                        "index": 79
                    }
                },
                "id": {
                    "type": "Identifier",
                    "start": 21,
                    "end": 26,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 21,
                            "index": 21
                        },
                        "end": {
                            "line": 1,
                            "column": 26,
                            "index": 26
                        },
                        "identifierName": "TestA"
                    },
                    "name": "TestA"
                },
                "superClass": null,
                "body": {
                    "type": "ClassBody",
                    "start": 26,
                    "end": 79,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 26,
                            "index": 26
                        },
                        "end": {
                            "line": 5,
                            "column": 1,
                            "index": 79
                        }
                    },
                    "body": [
                        {
                            "type": "ClassMethod",
                            "start": 32,
                            "end": 77,
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 4,
                                    "index": 32
                                },
                                "end": {
                                    "line": 4,
                                    "column": 5,
                                    "index": 77
                                }
                            },
                            "static": true,
                            "key": {
                                "type": "Identifier",
                                "start": 39,
                                "end": 42,
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 11,
                                        "index": 39
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 14,
                                        "index": 42
                                    },
                                    "identifierName": "log"
                                },
                                "name": "log"
                            },
                            "computed": false,
                            "kind": "method",
                            "id": null,
                            "generator": false,
                            "async": false,
                            "params": [
                                {
                                    "type": "Identifier",
                                    "start": 43,
                                    "end": 44,
                                    "loc": {
                                        "start": {
                                            "line": 2,
                                            "column": 15,
                                            "index": 43
                                        },
                                        "end": {
                                            "line": 2,
                                            "column": 16,
                                            "index": 44
                                        },
                                        "identifierName": "v"
                                    },
                                    "name": "v"
                                }
                            ],
                            "body": {
                                "type": "BlockStatement",
                                "start": 45,
                                "end": 77,
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 17,
                                        "index": 45
                                    },
                                    "end": {
                                        "line": 4,
                                        "column": 5,
                                        "index": 77
                                    }
                                },
                                "body": [
                                    {
                                        "type": "ExpressionStatement",
                                        "start": 55,
                                        "end": 71,
                                        "loc": {
                                            "start": {
                                                "line": 3,
                                                "column": 8,
                                                "index": 55
                                            },
                                            "end": {
                                                "line": 3,
                                                "column": 24,
                                                "index": 71
                                            }
                                        },
                                        "expression": {
                                            "type": "CallExpression",
                                            "start": 55,
                                            "end": 71,
                                            "loc": {
                                                "start": {
                                                    "line": 3,
                                                    "column": 8,
                                                    "index": 55
                                                },
                                                "end": {
                                                    "line": 3,
                                                    "column": 24,
                                                    "index": 71
                                                }
                                            },
                                            "callee": {
                                                "type": "MemberExpression",
                                                "start": 55,
                                                "end": 66,
                                                "loc": {
                                                    "start": {
                                                        "line": 3,
                                                        "column": 8,
                                                        "index": 55
                                                    },
                                                    "end": {
                                                        "line": 3,
                                                        "column": 19,
                                                        "index": 66
                                                    }
                                                },
                                                "object": {
                                                    "type": "Identifier",
                                                    "start": 55,
                                                    "end": 62,
                                                    "loc": {
                                                        "start": {
                                                            "line": 3,
                                                            "column": 8,
                                                            "index": 55
                                                        },
                                                        "end": {
                                                            "line": 3,
                                                            "column": 15,
                                                            "index": 62
                                                        },
                                                        "identifierName": "console"
                                                    },
                                                    "name": "console"
                                                },
                                                "computed": false,
                                                "property": {
                                                    "type": "Identifier",
                                                    "start": 63,
                                                    "end": 66,
                                                    "loc": {
                                                        "start": {
                                                            "line": 3,
                                                            "column": 16,
                                                            "index": 63
                                                        },
                                                        "end": {
                                                            "line": 3,
                                                            "column": 19,
                                                            "index": 66
                                                        },
                                                        "identifierName": "log"
                                                    },
                                                    "name": "log"
                                                }
                                            },
                                            "arguments": [
                                                {
                                                    "type": "NumericLiteral",
                                                    "start": 67,
                                                    "end": 70,
                                                    "loc": {
                                                        "start": {
                                                            "line": 3,
                                                            "column": 20,
                                                            "index": 67
                                                        },
                                                        "end": {
                                                            "line": 3,
                                                            "column": 23,
                                                            "index": 70
                                                        }
                                                    },
                                                    "extra": {
                                                        "rawValue": 123,
                                                        "raw": "123"
                                                    },
                                                    "value": 123
                                                }
                                            ]
                                        }
                                    }
                                ],
                                "directives": []
                            }
                        }
                    ]
                }
            }
        }
    ],
    "directives": []
}
// 验证 AST 节点是否包含位置信息
traverse(ast, {
    enter(path) {
        path.node.start = undefined
        path.node.end = undefined
        if (!path.node.loc) {
            throw Error(`Node of type ${path.node.type} is missing loc information.`);
        }
        path.node.loc.start.index = undefined
        path.node.loc.end.index = undefined
    }
});
