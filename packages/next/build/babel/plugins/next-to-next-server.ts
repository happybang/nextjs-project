import {PluginObj} from '@babel/core'
import {NodePath} from '@babel/traverse'
import {ImportDeclaration} from '@babel/types'
// Rewrite imports using next/<something> to next-server/<something>
export default function NextToNextServer (): PluginObj {
  return {
    visitor: {
      ImportDeclaration (path: NodePath<ImportDeclaration>) {
        const source = path.node.source.value
        if (source === 'next/dynamic') {
          path.node.source.value = 'inext-server/dynamic'
        }
        if (source === 'next/constants') {
          path.node.source.value = 'inext-server/constants'
        }
        if (source === 'next/config') {
          path.node.source.value = 'inext-server/config'
        }
        if (source === 'next/head') {
          path.node.source.value = 'inext-server/head'
        }
      }
    }
  }
}
